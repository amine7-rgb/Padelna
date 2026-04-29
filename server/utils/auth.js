import crypto from "node:crypto";
import jwt from "jsonwebtoken";

const env = (key, fallback = "") => String(process.env[key] || fallback).trim();

export const AUTH_COOKIE_NAME = "palina_token";
export const OAUTH_STATE_COOKIE = "palina_oauth_state";
export const OAUTH_REDIRECT_COOKIE = "palina_oauth_redirect";

const JWT_SECRET = () => env("JWT_SECRET", "palina-dev-jwt-secret-change-me");
const CLIENT_ORIGIN = () => env("CLIENT_ORIGIN", "http://localhost:5173");
const TOKEN_TTL_DAYS = Number(env("AUTH_TOKEN_TTL_DAYS", "7")) || 7;

export const getClientOrigin = () => CLIENT_ORIGIN();
export const isProduction = () => env("NODE_ENV") === "production";

export const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
export const isPhone = (value) => /^[+\d\s().-]{8,22}$/.test(String(value || "").trim());
export const isStrongPassword = (value) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,72}$/.test(String(value || ""));
export const isGender = (value) => ["", "men", "women"].includes(String(value || "").trim());

export const normalizeAvatarUrl = (value) => {
  const avatarUrl = String(value || "").trim();

  if (!avatarUrl) {
    return "";
  }

  if ((avatarUrl.startsWith("http://") || avatarUrl.startsWith("https://") || avatarUrl.startsWith("data:image/")) && avatarUrl.length <= 400000) {
    return avatarUrl;
  }

  return "";
};

export const normalizeLocation = (location = {}) => {
  const latitude = Number(location.latitude);
  const longitude = Number(location.longitude);

  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return { latitude: null, longitude: null };
  }

  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return { latitude: null, longitude: null };
  }

  return { latitude, longitude };
};

export const normalizeUserInput = (payload = {}) => ({
  firstName: String(payload.firstName || "").trim(),
  lastName: String(payload.lastName || "").trim(),
  email: String(payload.email || "").trim().toLowerCase(),
  password: String(payload.password || ""),
  gender: String(payload.gender || "").trim(),
  avatarUrl: normalizeAvatarUrl(payload.avatarUrl),
  phone: String(payload.phone || "").trim(),
  addressLine1: String(payload.addressLine1 || "").trim(),
  city: String(payload.city || "").trim(),
  postalCode: String(payload.postalCode || "").trim(),
  locationLabel: String(payload.locationLabel || "").trim(),
  location: normalizeLocation(payload.location || {})
});

export const isProfileCompleteInput = (input) =>
  Boolean(input.firstName && input.lastName && input.email && input.gender && input.phone && input.addressLine1 && input.city && input.postalCode);

export const validateSignupInput = (input) => {
  if (!input.firstName || !input.lastName || !input.email || !input.password) {
    const error = new Error("First name, last name, email and password are required.");
    error.statusCode = 400;
    throw error;
  }

  if (!isEmail(input.email)) {
    const error = new Error("Please provide a valid email address.");
    error.statusCode = 400;
    throw error;
  }

  if (!isStrongPassword(input.password)) {
    const error = new Error("Password must be at least 8 characters and include uppercase, lowercase, number and symbol.");
    error.statusCode = 400;
    throw error;
  }
};

export const validateProfileInput = (input) => {
  if (!isProfileCompleteInput(input)) {
    const error = new Error("First name, last name, email, gender, phone, address, city and postal code are required.");
    error.statusCode = 400;
    throw error;
  }

  if (!isEmail(input.email)) {
    const error = new Error("Please provide a valid email address.");
    error.statusCode = 400;
    throw error;
  }

  if (!isPhone(input.phone)) {
    const error = new Error("Please provide a valid phone number.");
    error.statusCode = 400;
    throw error;
  }

  if (!isGender(input.gender) || !input.gender) {
    const error = new Error("Please choose a valid gender.");
    error.statusCode = 400;
    throw error;
  }
};

export const createRandomToken = () => crypto.randomBytes(32).toString("hex");
export const hashToken = (value) => crypto.createHash("sha256").update(String(value)).digest("hex");

export const signAuthToken = (user) =>
  jwt.sign({ sub: user._id.toString(), role: user.role, email: user.email }, JWT_SECRET(), { expiresIn: `${TOKEN_TTL_DAYS}d` });

export const verifyAuthToken = (token) => jwt.verify(token, JWT_SECRET());

export const getAuthCookieOptions = () => ({
  httpOnly: true,
  sameSite: "lax",
  secure: isProduction(),
  maxAge: TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
  path: "/"
});

export const getShortCookieOptions = (hours = 1) => ({
  httpOnly: true,
  sameSite: "lax",
  secure: isProduction(),
  maxAge: hours * 60 * 60 * 1000,
  path: "/"
});

export const setAuthCookie = (res, token) => {
  res.cookie(AUTH_COOKIE_NAME, token, getAuthCookieOptions());
};

export const clearAuthCookie = (res) => {
  res.clearCookie(AUTH_COOKIE_NAME, { ...getAuthCookieOptions(), maxAge: 0 });
};

export const publicUser = (user) => ({
  id: user._id?.toString?.() || user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  fullName: `${user.firstName} ${user.lastName}`.trim(),
  email: user.email,
  gender: user.gender || "",
  phone: user.phone,
  addressLine1: user.addressLine1,
  city: user.city,
  postalCode: user.postalCode,
  locationLabel: user.locationLabel,
  location: user.location || { latitude: null, longitude: null },
  role: user.role,
  provider: user.provider,
  avatarUrl: user.avatarUrl || "",
  emailVerified: Boolean(user.emailVerified),
  hasPassword: Boolean(user.passwordHash),
  profileComplete: isProfileCompleteInput({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    gender: user.gender || "",
    phone: user.phone || "",
    addressLine1: user.addressLine1 || "",
    city: user.city || "",
    postalCode: user.postalCode || ""
  })
});

export const safeRedirectPath = (target = "/account") => {
  const value = String(target || "").trim();

  if (!value.startsWith("/") || value.startsWith("//")) {
    return "/account";
  }

  return value;
};
