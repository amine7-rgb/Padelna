import { User } from "../models/User.js";
import { verifyAuthToken, AUTH_COOKIE_NAME } from "../utils/auth.js";

const resolveUserFromCookie = async (req) => {
  const token = req.cookies?.[AUTH_COOKIE_NAME];

  if (!token) {
    return null;
  }

  try {
    const payload = verifyAuthToken(token);
    const user = await User.findById(payload.sub);
    return user || null;
  } catch {
    return null;
  }
};

export const optionalAuth = async (req, _res, next) => {
  req.user = await resolveUserFromCookie(req);
  next();
};

export const requireAuth = async (req, res, next) => {
  const user = await resolveUserFromCookie(req);

  if (!user) {
    return res.status(401).json({ error: "Please sign in to continue." });
  }

  req.user = user;
  return next();
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access is required." });
  }

  return next();
};
