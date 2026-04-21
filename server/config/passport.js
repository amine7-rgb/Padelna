import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { findOrCreateOAuthUser } from "../services/userAccounts.js";

const env = (key) => String(process.env[key] || "").trim();

export const isGoogleConfigured = () =>
  Boolean(env("GOOGLE_CLIENT_ID") && env("GOOGLE_CLIENT_SECRET") && env("GOOGLE_CALLBACK_URL"));

export const isFacebookConfigured = () =>
  Boolean(env("FACEBOOK_APP_ID") && env("FACEBOOK_APP_SECRET") && env("FACEBOOK_CALLBACK_URL"));

export const configurePassport = () => {
  if (isGoogleConfigured() && !passport._strategies.google) {
    passport.use(
      "google",
      new GoogleStrategy(
        {
          clientID: env("GOOGLE_CLIENT_ID"),
          clientSecret: env("GOOGLE_CLIENT_SECRET"),
          callbackURL: env("GOOGLE_CALLBACK_URL")
        },
        async (_accessToken, _refreshToken, profile, done) => {
          try {
            const user = await findOrCreateOAuthUser("google", profile);
            done(null, user);
          } catch (error) {
            done(error);
          }
        }
      )
    );
  }

  if (isFacebookConfigured() && !passport._strategies.facebook) {
    passport.use(
      "facebook",
      new FacebookStrategy(
        {
          clientID: env("FACEBOOK_APP_ID"),
          clientSecret: env("FACEBOOK_APP_SECRET"),
          callbackURL: env("FACEBOOK_CALLBACK_URL"),
          profileFields: ["id", "displayName", "name", "emails", "photos"],
          enableProof: true
        },
        async (_accessToken, _refreshToken, profile, done) => {
          try {
            const user = await findOrCreateOAuthUser("facebook", profile);
            done(null, user);
          } catch (error) {
            done(error);
          }
        }
      )
    );
  }
};

export default passport;
