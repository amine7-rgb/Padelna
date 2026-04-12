import Stripe from "stripe";
import { isMongoConnected } from "../config/db.js";
import { getRuntimeProductBySlug } from "../data/products.js";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { sendOrderNotifications } from "../utils/orderEmails.js";

const getStripeClient = () => (process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null);
const getClientOrigin = () => process.env.CLIENT_ORIGIN || "http://localhost:5173";
const getCardCurrency = () => (process.env.STRIPE_CARD_CURRENCY || "eur").toLowerCase();
const getTndToCardRate = () => Number(process.env.STRIPE_TND_TO_CARD_RATE || 0);

const requireMongo = () => {
  if (!isMongoConnected()) {
    const error = new Error("Checkout requires an active MongoDB connection.");
    error.statusCode = 503;
    throw error;
  }
};

const readProductBySlug = async (slug) => {
  if (isMongoConnected()) {
    return Product.findOne({ slug }).lean();
  }

  return getRuntimeProductBySlug(slug);
};

const normalizeCustomer = (customer = {}) => ({
  name: String(customer.name || "").trim(),
  email: String(customer.email || "").trim(),
  phone: String(customer.phone || "").trim(),
  addressLine1: String(customer.addressLine1 || "").trim(),
  city: String(customer.city || "").trim(),
  postalCode: String(customer.postalCode || "").trim(),
  notes: String(customer.notes || "").trim()
});

const validateCustomer = (customer) => {
  if (!customer.name || !customer.email || !customer.phone || !customer.addressLine1 || !customer.city) {
    const error = new Error("Name, email, phone, address and city are required.");
    error.statusCode = 400;
    throw error;
  }
};

const calculateTotals = (subtotalTnd) => {
  const deliveryTnd = subtotalTnd >= 320 ? 0 : 14;
  const vatTnd = Number((subtotalTnd * 0.19).toFixed(2));
  const totalTnd = Number((subtotalTnd + deliveryTnd + vatTnd).toFixed(2));

  return { subtotalTnd, deliveryTnd, vatTnd, totalTnd };
};

const convertToCardMinor = (amountTnd) => {
  const cardCurrency = getCardCurrency();
  const tndToCardRate = getTndToCardRate();

  if (cardCurrency === "tnd") {
    const error = new Error("Stripe card checkout can't be configured with TND. Use a supported currency like EUR or USD.");
    error.statusCode = 400;
    throw error;
  }

  if (!tndToCardRate || Number.isNaN(tndToCardRate) || tndToCardRate <= 0) {
    const error = new Error("Set STRIPE_TND_TO_CARD_RATE in your environment before using card payments.");
    error.statusCode = 500;
    throw error;
  }

  return Math.max(1, Math.round(amountTnd * tndToCardRate * 100));
};

const resolveStripeImageUrl = (imageUrl) => {
  if (!imageUrl) {
    return null;
  }

  if (/^https?:\/\//i.test(imageUrl)) {
    return imageUrl;
  }

  return `${getClientOrigin().replace(/\/$/, "")}${imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`}`;
};

const buildOrderDraft = async (cartItems = [], customer) => {
  if (!Array.isArray(cartItems) || !cartItems.length) {
    const error = new Error("Your cart is empty.");
    error.statusCode = 400;
    throw error;
  }

  const items = [];

  for (const cartItem of cartItems) {
    const product = await readProductBySlug(cartItem.slug);

    if (!product) {
      const error = new Error(`Product ${cartItem.slug} was not found.`);
      error.statusCode = 404;
      throw error;
    }

    const quantity = Math.max(1, Number(cartItem.quantity || 1));
    items.push({
      slug: product.slug,
      name: product.name,
      gender: product.gender,
      size: cartItem.size || null,
      image: product.images?.[0]?.url || "",
      quantity,
      unitPriceTnd: product.price,
      subtotalTnd: product.price * quantity
    });
  }

  const subtotalTnd = items.reduce((sum, item) => sum + item.subtotalTnd, 0);
  return { items, totals: calculateTotals(subtotalTnd), customer };
};

const buildStripeLineItems = (order) => {
  const cardCurrency = getCardCurrency();
  const productLineItems = order.items.map((item) => ({
    quantity: item.quantity,
    price_data: {
      currency: cardCurrency,
      unit_amount: convertToCardMinor(item.unitPriceTnd),
      product_data: {
        name: item.name,
        description: [item.gender, item.size ? `Size ${item.size}` : null].filter(Boolean).join(" - "),
        ...(resolveStripeImageUrl(item.image) ? { images: [resolveStripeImageUrl(item.image)] } : {})
      }
    }
  }));

  const serviceLineItems = [];

  if (order.totals.deliveryTnd > 0) {
    serviceLineItems.push({
      quantity: 1,
      price_data: {
        currency: cardCurrency,
        unit_amount: convertToCardMinor(order.totals.deliveryTnd),
        product_data: { name: "Delivery" }
      }
    });
  }

  if (order.totals.vatTnd > 0) {
    serviceLineItems.push({
      quantity: 1,
      price_data: {
        currency: cardCurrency,
        unit_amount: convertToCardMinor(order.totals.vatTnd),
        product_data: { name: "VAT" }
      }
    });
  }

  return [...productLineItems, ...serviceLineItems];
};

const publicOrder = (order) => ({
  orderNumber: order.orderNumber,
  paymentMethod: order.paymentMethod,
  paymentStatus: order.paymentStatus,
  orderStatus: order.orderStatus,
  totals: order.totals,
  customer: order.customer,
  createdAt: order.createdAt
});

const shouldNotifyOrder = (order) =>
  order.orderStatus === "confirmed" && (order.paymentStatus === "paid" || order.paymentStatus === "cash_due");

const finalizeOrderNotifications = async (order) => {
  if (!shouldNotifyOrder(order)) {
    return;
  }

  await sendOrderNotifications(order);
};

export const createCardCheckoutSession = async (req, res) => {
  try {
    requireMongo();

    const stripe = getStripeClient();

    if (!stripe) {
      return res.status(500).json({ error: "Stripe is not configured. Add STRIPE_SECRET_KEY first." });
    }

    const customer = normalizeCustomer(req.body?.customer);
    validateCustomer(customer);

    const draft = await buildOrderDraft(req.body?.cartItems, customer);
    const order = await Order.create({
      customer,
      items: draft.items,
      totals: {
        ...draft.totals,
        cardCurrency: getCardCurrency(),
        cardExchangeRate: getTndToCardRate(),
        cardTotalMinor: convertToCardMinor(draft.totals.totalTnd)
      },
      paymentMethod: "card",
      paymentStatus: "pending",
      orderStatus: "awaiting_payment"
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${getClientOrigin()}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${getClientOrigin()}/checkout/cancel?order=${order.orderNumber}`,
      customer_email: customer.email,
      metadata: {
        orderId: order._id.toString(),
        orderNumber: order.orderNumber
      },
      payment_intent_data: {
        metadata: {
          orderId: order._id.toString(),
          orderNumber: order.orderNumber
        }
      },
      line_items: buildStripeLineItems(order)
    });

    order.stripeSessionId = session.id;
    await order.save();

    return res.status(201).json({
      ok: true,
      checkoutUrl: session.url,
      order: publicOrder(order)
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message || "Unable to start card checkout." });
  }
};

export const createCashOrder = async (req, res) => {
  try {
    requireMongo();

    const customer = normalizeCustomer(req.body?.customer);
    validateCustomer(customer);

    const draft = await buildOrderDraft(req.body?.cartItems, customer);
    const order = await Order.create({
      customer,
      items: draft.items,
      totals: {
        ...draft.totals,
        cardCurrency: getCardCurrency(),
        cardExchangeRate: getTndToCardRate() || null,
        cardTotalMinor: null
      },
      paymentMethod: "cash_on_delivery",
      paymentStatus: "cash_due",
      orderStatus: "confirmed"
    });

    await finalizeOrderNotifications(order);

    return res.status(201).json({ ok: true, order: publicOrder(order) });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message || "Unable to place the cash order." });
  }
};

export const getCheckoutOrder = async (req, res) => {
  try {
    requireMongo();

    const order = await Order.findOne({ orderNumber: req.params.orderNumber }).lean();

    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }

    return res.json({ ok: true, order: publicOrder(order) });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message || "Unable to fetch the order." });
  }
};

export const getCheckoutSessionStatus = async (req, res) => {
  try {
    requireMongo();

    const stripe = getStripeClient();

    if (!stripe) {
      return res.status(500).json({ error: "Stripe is not configured." });
    }

    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    const order =
      (session.metadata?.orderNumber && (await Order.findOne({ orderNumber: session.metadata.orderNumber }))) ||
      (session.id && (await Order.findOne({ stripeSessionId: session.id })));

    if (!order) {
      return res.status(404).json({ error: "Order not found for this session." });
    }

    if (session.payment_status === "paid" && order.paymentStatus !== "paid") {
      order.paymentStatus = "paid";
      order.orderStatus = "confirmed";
      order.stripePaymentIntentId = String(session.payment_intent || order.stripePaymentIntentId || "");
      await order.save();
    }

    await finalizeOrderNotifications(order);

    return res.json({
      ok: true,
      session: {
        id: session.id,
        status: session.status,
        paymentStatus: session.payment_status
      },
      order: publicOrder(order.toObject())
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message || "Unable to fetch the checkout session." });
  }
};

const updateOrderFromStripeEvent = async (eventType, payload) => {
  if (!isMongoConnected()) {
    return;
  }

  const order =
    (payload.metadata?.orderNumber && (await Order.findOne({ orderNumber: payload.metadata.orderNumber }))) ||
    (payload.id && (await Order.findOne({ stripeSessionId: payload.id }))) ||
    (payload.payment_intent && (await Order.findOne({ stripePaymentIntentId: payload.payment_intent })));

  if (!order) {
    return;
  }

  switch (eventType) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded":
      order.paymentStatus = "paid";
      order.orderStatus = "confirmed";
      order.stripePaymentIntentId = String(payload.payment_intent || order.stripePaymentIntentId || "");
      break;
    case "checkout.session.async_payment_failed":
      order.paymentStatus = "failed";
      order.orderStatus = "cancelled";
      order.stripePaymentIntentId = String(payload.payment_intent || order.stripePaymentIntentId || "");
      break;
    case "payment_intent.payment_failed":
      order.paymentStatus = "failed";
      order.orderStatus = "cancelled";
      order.stripePaymentIntentId = String(payload.id || order.stripePaymentIntentId || "");
      break;
    default:
      return;
  }

  await order.save();
  await finalizeOrderNotifications(order);
};

export const handleStripeWebhook = async (req, res) => {
  const stripe = getStripeClient();

  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(400).send("Stripe webhook is not configured.");
  }

  const signature = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded" ||
      event.type === "checkout.session.async_payment_failed" ||
      event.type === "payment_intent.payment_failed"
    ) {
      await updateOrderFromStripeEvent(event.type, event.data.object);
    }
  } catch (error) {
    return res.status(500).send(`Webhook handler error: ${error.message}`);
  }

  return res.json({ received: true });
};
