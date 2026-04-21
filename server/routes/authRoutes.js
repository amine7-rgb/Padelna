import express from "express";
import rateLimit from "express-rate-limit";
import passport from "../config/passport.js";
import {
  OAUTH_REDIRECT_COOKIE,
  OAUTH_STATE_COOKIE,
  clearAuthCookie,
  getClientOrigin,
  getShortCookieOptions,
  safeRedirectPath,
  setAuthCookie,
  signAuthToken
} from "../utils/auth.js";
import {
  changePassword,
  forgotPassword,
  getAdminOrders,
  getAdminSummary,
  getSession,
  login,
  logout,
  resendVerification,
  resetPassword,
  signup,
  updateAdminOrderStatus,
  updateProfile,
  verifyEmail
} from "../controllers/authController.js";
import { optionalAuth, requireAdmin, requireAuth } from "../middleware/authMiddleware.js";
import { isFacebookConfigured, isGoogleConfigured } from "../config/passport.js";
import { createRandomToken } from "../utils/auth.js";

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 12,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many authentication attempts. Please try again in a few minutes." }
});

const startOAuth = (provider, optionsBuilder) => (req, res, next) => {
  const redirect = safeRedirectPath(req.query.redirect || "/account");
  const state = createRandomToken();

  res.cookie(OAUTH_STATE_COOKIE, state, getShortCookieOptions(1));
  res.cookie(OAUTH_REDIRECT_COOKIE, redirect, getShortCookieOptions(1));

  return passport.authenticate(provider, optionsBuilder(state))(req, res, next);
};

const completeOAuth = (provider, isConfigured) => (req, res, next) => {
  if (!isConfigured()) {
    return res.redirect(`${getClientOrigin()}/login?oauth=${provider}-disabled`);
  }

  if (!req.query.state || req.query.state !== req.cookies?.[OAUTH_STATE_COOKIE]) {
    return res.redirect(`${getClientOrigin()}/login?oauth=${provider}-state`);
  }

  return passport.authenticate(provider, { session: false }, (error, user) => {
    if (error || !user) {
      return res.redirect(`${getClientOrigin()}/login?oauth=${provider}-failed`);
    }

    clearAuthCookie(res);
    setAuthCookie(res, signAuthToken(user));
    res.clearCookie(OAUTH_STATE_COOKIE, { ...getShortCookieOptions(1), maxAge: 0 });
    const redirect = safeRedirectPath(req.cookies?.[OAUTH_REDIRECT_COOKIE] || "/account");
    res.clearCookie(OAUTH_REDIRECT_COOKIE, { ...getShortCookieOptions(1), maxAge: 0 });
    return res.redirect(`${getClientOrigin()}${redirect}`);
  })(req, res, next);
};

router.get("/session", optionalAuth, getSession);
router.post("/signup", authLimiter, signup);
router.post("/login", authLimiter, login);
router.post("/logout", logout);
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password", authLimiter, resetPassword);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", requireAuth, resendVerification);
router.put("/profile", requireAuth, updateProfile);
router.post("/change-password", requireAuth, changePassword);
router.get("/admin/summary", requireAuth, requireAdmin, getAdminSummary);
router.get("/admin/orders", requireAuth, requireAdmin, getAdminOrders);
router.patch("/admin/orders/:orderNumber", requireAuth, requireAdmin, updateAdminOrderStatus);

router.get(
  "/google",
  (req, res, next) => {
    if (!isGoogleConfigured()) {
      return res.redirect(`${getClientOrigin()}/login?oauth=google-disabled`);
    }
    return next();
  },
  startOAuth("google", (state) => ({ scope: ["profile", "email"], session: false, state }))
);

router.get("/google/callback", completeOAuth("google", isGoogleConfigured));

router.get(
  "/facebook",
  (req, res, next) => {
    if (!isFacebookConfigured()) {
      return res.redirect(`${getClientOrigin()}/login?oauth=facebook-disabled`);
    }
    return next();
  },
  startOAuth("facebook", (state) => ({ scope: ["email"], session: false, state }))
);

router.get("/facebook/callback", completeOAuth("facebook", isFacebookConfigured));

export default router;
