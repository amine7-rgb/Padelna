import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { isMongoConnected } from "../config/db.js";

const getProfileEmail = (profile) => String(profile?.emails?.[0]?.value || "").trim().toLowerCase();
const getProfileAvatar = (profile) => String(profile?.photos?.[0]?.value || "").trim();
const getProfileFirstName = (profile) => String(profile?.name?.givenName || profile?.displayName || "Padelna").trim();
const getProfileLastName = (profile) => String(profile?.name?.familyName || "User").trim();

export const findOrCreateOAuthUser = async (provider, profile) => {
  const email = getProfileEmail(profile);

  if (!email) {
    const error = new Error("Your social account did not share an email address.");
    error.statusCode = 400;
    throw error;
  }

  const providerField = provider === "google" ? "googleId" : "facebookId";
  const providerId = String(profile.id || "");
  let user = await User.findOne({ $or: [{ email }, { [providerField]: providerId }] });

  if (!user) {
    user = await User.create({
      firstName: getProfileFirstName(profile),
      lastName: getProfileLastName(profile),
      email,
      gender: "",
      phone: "+216",
      addressLine1: "To be completed",
      city: "Tunis",
      postalCode: "",
      locationLabel: "",
      provider,
      role: "user",
      emailVerified: true,
      avatarUrl: getProfileAvatar(profile),
      [providerField]: providerId
    });

    return user;
  }

  const updates = {
    provider: user.provider === "local" ? provider : user.provider,
    emailVerified: true,
    avatarUrl: user.avatarUrl || getProfileAvatar(profile),
    [providerField]: providerId
  };

  await User.updateOne({ _id: user._id }, { $set: updates });
  Object.assign(user, updates);

  return user;
};

export const seedAdminUserIfNeeded = async () => {
  if (!isMongoConnected()) {
    return false;
  }

  const email = String(process.env.ADMIN_EMAIL || "amed14170@gmail.com").trim().toLowerCase();
  const password = String(process.env.ADMIN_PASSWORD || "admin?123");

  let user = await User.findOne({ email });

  if (user) {
    let hasUpdates = false;

    if (user.role !== "admin") {
      user.role = "admin";
      hasUpdates = true;
    }

    if (!user.passwordHash) {
      user.passwordHash = await bcrypt.hash(password, 12);
      hasUpdates = true;
    }

    if (!user.emailVerified) {
      user.emailVerified = true;
      hasUpdates = true;
    }

    if (!user.firstName) {
      user.firstName = "Med";
      hasUpdates = true;
    }

    if (!user.lastName) {
      user.lastName = "Amine";
      hasUpdates = true;
    }

    if (!user.phone) {
      user.phone = "+216 51 833 422";
      hasUpdates = true;
    }

    if (!user.gender) {
      user.gender = "men";
      hasUpdates = true;
    }

    if (!user.addressLine1) {
      user.addressLine1 = "Tunis";
      hasUpdates = true;
    }

    if (!user.city) {
      user.city = "Tunis";
      hasUpdates = true;
    }

    if (!user.locationLabel) {
      user.locationLabel = "Padelna HQ";
      hasUpdates = true;
    }

    if (hasUpdates) {
      await user.save();
    }

    return false;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await User.create({
    firstName: "Med",
    lastName: "Amine",
    email,
    passwordHash,
    gender: "men",
    role: "admin",
    provider: "local",
    emailVerified: true,
    phone: "+216 51 833 422",
    addressLine1: "Tunis",
    city: "Tunis",
    postalCode: "1000",
    locationLabel: "Padelna HQ"
  });

  return true;
};
