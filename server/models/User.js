import mongoose from "mongoose";

const pointSchema = new mongoose.Schema(
  {
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true, maxlength: 80 },
    lastName: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true, maxlength: 180 },
    passwordHash: { type: String, default: "" },
    role: { type: String, required: true, enum: ["admin", "user"], default: "user" },
    provider: { type: String, trim: true, default: "local" },
    googleId: { type: String, trim: true, default: "" },
    facebookId: { type: String, trim: true, default: "" },
    gender: { type: String, trim: true, enum: ["", "men", "women"], default: "" },
    avatarUrl: { type: String, trim: true, default: "" },
    emailVerified: { type: Boolean, default: false },
    phone: { type: String, required: true, trim: true, maxlength: 40 },
    addressLine1: { type: String, required: true, trim: true, maxlength: 220 },
    city: { type: String, required: true, trim: true, maxlength: 120 },
    postalCode: { type: String, trim: true, maxlength: 40, default: "" },
    locationLabel: { type: String, trim: true, maxlength: 220, default: "" },
    location: { type: pointSchema, default: () => ({ latitude: null, longitude: null }) },
    verificationTokenHash: { type: String, default: "" },
    verificationTokenExpiresAt: { type: Date, default: null },
    resetPasswordTokenHash: { type: String, default: "" },
    resetPasswordTokenExpiresAt: { type: Date, default: null },
    lastLoginAt: { type: Date, default: null }
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
