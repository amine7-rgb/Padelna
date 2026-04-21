import bcrypt from "bcryptjs";
import { Order } from "../models/Order.js";
import { User } from "../models/User.js";
import {
  clearAuthCookie,
  createRandomToken,
  hashToken,
  isStrongPassword,
  normalizeUserInput,
  publicUser,
  setAuthCookie,
  signAuthToken,
  validateProfileInput,
  validateSignupInput
} from "../utils/auth.js";
import { sendResetPasswordEmail, sendVerificationEmail } from "../utils/authEmails.js";
import { isFacebookConfigured, isGoogleConfigured } from "../config/passport.js";

const createVerificationState = async (user) => {
  const verificationToken = createRandomToken();
  const verificationState = {
    verificationTokenHash: hashToken(verificationToken),
    verificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
  };

  await User.updateOne({ _id: user._id }, { $set: verificationState });
  Object.assign(user, verificationState);
  return verificationToken;
};

const sendEmailSafely = async (sendFn, ...args) => {
  try {
    return await sendFn(...args);
  } catch (error) {
    console.warn(`Email delivery skipped: ${error.message}`);
    return false;
  }
};

const applyProfileInput = (user, input) => {
  user.firstName = input.firstName;
  user.lastName = input.lastName;
  user.email = input.email;
  user.gender = input.gender || "";
  user.avatarUrl = input.avatarUrl || "";
  user.phone = input.phone;
  user.addressLine1 = input.addressLine1;
  user.city = input.city;
  user.postalCode = input.postalCode;
  user.locationLabel = input.locationLabel;
  user.location = input.location;
};

const ADMIN_PAYMENT_METHODS = ["card", "cash_on_delivery"];
const ADMIN_PAYMENT_STATUSES = ["pending", "paid", "failed", "cash_due", "cancelled"];
const ADMIN_ORDER_STATUSES = ["awaiting_payment", "confirmed", "preparing", "delivered", "returned", "blocked", "cancelled"];
const ADMIN_SORTS = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 }
};

const toPositiveInteger = (value, fallback) => {
  const parsed = Number.parseInt(String(value || ""), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const normalizeAdminDate = (value, endOfDay = false) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  if (endOfDay) {
    date.setHours(23, 59, 59, 999);
  } else {
    date.setHours(0, 0, 0, 0);
  }

  return date;
};

const formatAdminOrder = (order) => ({
  orderNumber: order.orderNumber,
  paymentMethod: order.paymentMethod,
  paymentStatus: order.paymentStatus,
  orderStatus: order.orderStatus,
  customer: order.customer,
  totalTnd: order.totals?.totalTnd || 0,
  itemCount: Array.isArray(order.items) ? order.items.reduce((total, item) => total + (item.quantity || 0), 0) : 0,
  createdAt: order.createdAt
});

export const getSession = async (req, res) => {
  return res.json({
    ok: true,
    user: req.user ? publicUser(req.user) : null,
    providers: {
      google: isGoogleConfigured(),
      facebook: isFacebookConfigured()
    }
  });
};

export const signup = async (req, res) => {
  try {
    const input = normalizeUserInput(req.body);
    validateSignupInput(input);

    const existingUser = await User.findOne({ email: input.email });

    if (existingUser) {
      return res.status(409).json({ error: "An account already exists for this email address." });
    }

    const passwordHash = await bcrypt.hash(input.password, 12);
    const user = await User.create({
      ...input,
      passwordHash,
      provider: "local",
      role: "user",
      emailVerified: false
    });

    const verificationToken = await createVerificationState(user);
    const verificationSent = await sendEmailSafely(sendVerificationEmail, user, verificationToken);

    setAuthCookie(res, signAuthToken(user));

    return res.status(201).json({
      ok: true,
      user: publicUser(user),
      verificationSent
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ error: "An account already exists for this email address." });
    }

    return res.status(error.statusCode || 500).json({ error: error.message || "Unable to create your account." });
  }
};

export const login = async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = await User.findOne({ email });

    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const matches = await bcrypt.compare(password, user.passwordHash);

    if (!matches) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const lastLoginAt = new Date();
    await User.updateOne({ _id: user._id }, { $set: { lastLoginAt } });
    user.lastLoginAt = lastLoginAt;

    setAuthCookie(res, signAuthToken(user));
    return res.json({ ok: true, user: publicUser(user) });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Unable to sign you in." });
  }
};

export const logout = async (_req, res) => {
  clearAuthCookie(res);
  return res.json({ ok: true });
};

export const updateProfile = async (req, res) => {
  try {
    const input = normalizeUserInput({ ...req.user.toObject(), ...req.body, password: "placeholderA1!" });
    validateProfileInput(input);

    const existingEmail = await User.findOne({ email: input.email, _id: { $ne: req.user._id } });

    if (existingEmail) {
      return res.status(409).json({ error: "This email is already linked to another account." });
    }

    const emailChanged = req.user.email !== input.email;
    applyProfileInput(req.user, input);

    if (emailChanged) {
      req.user.emailVerified = false;
      const verificationToken = await createVerificationState(req.user);
      await sendVerificationEmail(req.user, verificationToken);
    }

    await req.user.save();
    setAuthCookie(res, signAuthToken(req.user));

    return res.json({ ok: true, user: publicUser(req.user), emailChanged });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message || "Unable to update your account." });
  }
};

export const changePassword = async (req, res) => {
  try {
    const currentPassword = String(req.body?.currentPassword || "");
    const nextPassword = String(req.body?.nextPassword || "");

    if (!req.user.passwordHash) {
      return res.status(400).json({ error: "This account uses social sign-in. Set a password later from admin tools." });
    }

    if (!currentPassword || !nextPassword) {
      return res.status(400).json({ error: "Current password and new password are required." });
    }

    if (!isStrongPassword(nextPassword)) {
      return res.status(400).json({ error: "New password must include uppercase, lowercase, number and symbol." });
    }

    const matches = await bcrypt.compare(currentPassword, req.user.passwordHash);

    if (!matches) {
      return res.status(401).json({ error: "Current password is incorrect." });
    }

    req.user.passwordHash = await bcrypt.hash(nextPassword, 12);
    await req.user.save();

    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Unable to change the password." });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();

    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    const user = await User.findOne({ email });

    if (user && user.passwordHash) {
      const resetToken = createRandomToken();
      const resetPasswordState = {
        resetPasswordTokenHash: hashToken(resetToken),
        resetPasswordTokenExpiresAt: new Date(Date.now() + 60 * 60 * 1000)
      };

      await User.updateOne({ _id: user._id }, { $set: resetPasswordState });
      Object.assign(user, resetPasswordState);
      await sendEmailSafely(sendResetPasswordEmail, user, resetToken);
    }

    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Unable to start password reset." });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const token = String(req.body?.token || "");
    const password = String(req.body?.password || "");

    if (!token || !password) {
      return res.status(400).json({ error: "Reset token and new password are required." });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({ error: "Password must include uppercase, lowercase, number and symbol." });
    }

    const user = await User.findOne({
      resetPasswordTokenHash: hashToken(token),
      resetPasswordTokenExpiresAt: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ error: "This reset link is invalid or expired." });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const resetState = {
      passwordHash,
      resetPasswordTokenHash: "",
      resetPasswordTokenExpiresAt: null
    };

    await User.updateOne({ _id: user._id }, { $set: resetState });
    Object.assign(user, resetState);

    setAuthCookie(res, signAuthToken(user));
    return res.json({ ok: true, user: publicUser(user) });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Unable to reset the password." });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const token = String(req.body?.token || "");

    if (!token) {
      return res.status(400).json({ error: "Verification token is required." });
    }

    const user = await User.findOne({
      verificationTokenHash: hashToken(token),
      verificationTokenExpiresAt: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ error: "This verification link is invalid or expired." });
    }

    const verificationState = {
      emailVerified: true,
      verificationTokenHash: "",
      verificationTokenExpiresAt: null
    };

    await User.updateOne({ _id: user._id }, { $set: verificationState });
    Object.assign(user, verificationState);

    setAuthCookie(res, signAuthToken(user));
    return res.json({ ok: true, user: publicUser(user) });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Unable to verify this email." });
  }
};

export const resendVerification = async (req, res) => {
  try {
    if (req.user.emailVerified) {
      return res.json({ ok: true, alreadyVerified: true });
    }

    const verificationToken = await createVerificationState(req.user);
    const verificationSent = await sendEmailSafely(sendVerificationEmail, req.user, verificationToken);

    return res.json({ ok: true, verificationSent });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Unable to resend verification email." });
  }
};

export const getAdminSummary = async (_req, res) => {
  try {
    const trendStart = new Date();
    trendStart.setHours(0, 0, 0, 0);
    trendStart.setDate(trendStart.getDate() - 6);

    const [users, orders, revenueRows, paymentRows, statusRows, trendRows, recentOrders] = await Promise.all([
      User.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        {
          $group: {
            _id: null,
            grossRevenue: { $sum: "$totals.totalTnd" },
            paidRevenue: {
              $sum: {
                $cond: [{ $eq: ["$paymentStatus", "paid"] }, "$totals.totalTnd", 0]
              }
            }
          }
        }
      ]),
      Order.aggregate([
        {
          $group: {
            _id: "$paymentMethod",
            count: { $sum: 1 }
          }
        }
      ]),
      Order.aggregate([
        {
          $group: {
            _id: "$orderStatus",
            count: { $sum: 1 }
          }
        }
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: trendStart } } },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
            },
            orders: { $sum: 1 },
            revenue: { $sum: "$totals.totalTnd" }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(8)
        .select("orderNumber paymentMethod paymentStatus orderStatus customer totals.totalTnd items createdAt")
    ]);

    const revenue = revenueRows[0] || { grossRevenue: 0, paidRevenue: 0 };
    const paymentMix = paymentRows.reduce(
      (accumulator, row) => ({
        ...accumulator,
        [row._id]: row.count
      }),
      { card: 0, cash_on_delivery: 0 }
    );
    const statusMix = statusRows.reduce((accumulator, row) => ({ ...accumulator, [row._id]: row.count }), {});

    const trendMap = new Map(trendRows.map((row) => [row._id, row]));
    const trend = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(trendStart);
      date.setDate(trendStart.getDate() + index);
      const key = date.toISOString().slice(0, 10);
      const row = trendMap.get(key);

      return {
        key,
        label: date.toLocaleDateString("en-US", { weekday: "short" }),
        orders: row?.orders || 0,
        revenue: row?.revenue || 0
      };
    });

    return res.json({
      ok: true,
      summary: {
        users,
        orders,
        grossRevenue: revenue.grossRevenue || 0,
        paidRevenue: revenue.paidRevenue || 0,
        averageOrderValue: orders ? Number(((revenue.grossRevenue || 0) / orders).toFixed(2)) : 0,
        paymentMix,
        statusMix,
        trend,
        recentOrders: recentOrders.map(formatAdminOrder)
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Unable to load admin summary." });
  }
};

export const getAdminOrders = async (req, res) => {
  try {
    const page = toPositiveInteger(req.query.page, 1);
    const pageSize = Math.min(toPositiveInteger(req.query.pageSize, 8), 50);
    const sortKey = Object.prototype.hasOwnProperty.call(ADMIN_SORTS, req.query.sort) ? req.query.sort : "newest";
    const paymentMethod = ADMIN_PAYMENT_METHODS.includes(req.query.paymentMethod) ? req.query.paymentMethod : "";
    const paymentStatus = ADMIN_PAYMENT_STATUSES.includes(req.query.paymentStatus) ? req.query.paymentStatus : "";
    const orderStatus = ADMIN_ORDER_STATUSES.includes(req.query.orderStatus) ? req.query.orderStatus : "";
    const orderNumber = String(req.query.orderNumber || "").trim().toUpperCase();
    const dateFrom = normalizeAdminDate(req.query.dateFrom);
    const dateTo = normalizeAdminDate(req.query.dateTo, true);

    const match = {};

    if (paymentMethod) {
      match.paymentMethod = paymentMethod;
    }

    if (paymentStatus) {
      match.paymentStatus = paymentStatus;
    }

    if (orderStatus) {
      match.orderStatus = orderStatus;
    }

    if (orderNumber) {
      match.orderNumber = { $regex: orderNumber.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };
    }

    if (dateFrom || dateTo) {
      match.createdAt = {};

      if (dateFrom) {
        match.createdAt.$gte = dateFrom;
      }

      if (dateTo) {
        match.createdAt.$lte = dateTo;
      }
    }

    const [totalItems, orders] = await Promise.all([
      Order.countDocuments(match),
      Order.find(match)
        .sort(ADMIN_SORTS[sortKey])
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .select("orderNumber paymentMethod paymentStatus orderStatus customer totals.totalTnd items createdAt")
        .lean()
    ]);

    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

    return res.json({
      ok: true,
      orders: orders.map(formatAdminOrder),
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Unable to load admin orders." });
  }
};

export const updateAdminOrderStatus = async (req, res) => {
  try {
    const orderNumber = String(req.params.orderNumber || "").trim().toUpperCase();
    const order = await Order.findOne({ orderNumber })
      .select("orderNumber paymentMethod paymentStatus orderStatus customer totals.totalTnd items createdAt")
      .lean();

    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }

    const paymentStatus = String(req.body?.paymentStatus || "").trim();
    const orderStatus = String(req.body?.orderStatus || "").trim();

    if (!paymentStatus && !orderStatus) {
      return res.status(400).json({ error: "Choose at least one status to update." });
    }

    if (paymentStatus && !ADMIN_PAYMENT_STATUSES.includes(paymentStatus)) {
      return res.status(400).json({ error: "Unsupported payment status." });
    }

    if (orderStatus && !ADMIN_ORDER_STATUSES.includes(orderStatus)) {
      return res.status(400).json({ error: "Unsupported order status." });
    }

    let nextPaymentStatus = paymentStatus || order.paymentStatus;
    let nextOrderStatus = orderStatus || order.orderStatus;

    if (nextOrderStatus === "returned" || nextOrderStatus === "cancelled") {
      nextPaymentStatus = paymentStatus || "cancelled";
    }

    if (nextPaymentStatus === "paid" && nextOrderStatus === "awaiting_payment") {
      nextOrderStatus = "confirmed";
    }

    if (nextPaymentStatus === "cancelled" && !orderStatus) {
      nextOrderStatus = "cancelled";
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { orderNumber },
      {
        $set: {
          paymentStatus: nextPaymentStatus,
          orderStatus: nextOrderStatus
        }
      },
      { new: true }
    )
      .select("orderNumber paymentMethod paymentStatus orderStatus customer totals.totalTnd items createdAt")
      .lean();

    return res.json({ ok: true, order: formatAdminOrder(updatedOrder) });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Unable to update the order status." });
  }
};
