export const isProfileComplete = (user) =>
  Boolean(
    user &&
      String(user.firstName || "").trim() &&
      String(user.lastName || "").trim() &&
      String(user.email || "").trim() &&
      String(user.gender || "").trim() &&
      String(user.phone || "").trim() &&
      String(user.addressLine1 || "").trim() &&
      String(user.city || "").trim() &&
      String(user.postalCode || "").trim()
  );

export const getProfileCompletionRedirect = (redirect = "/checkout") =>
  `/account?redirect=${encodeURIComponent(redirect || "/checkout")}`;

export const resolvePostAuthRedirect = (user, redirect = "/account") => (isProfileComplete(user) ? redirect : getProfileCompletionRedirect(redirect));
