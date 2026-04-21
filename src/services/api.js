const parseResponse = async (response) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong.");
  }

  return data;
};

const request = async (url, options = {}) => {
  const response = await fetch(url, {
    credentials: "include",
    ...options
  });

  return parseResponse(response);
};

export const api = {
  fetchProducts: async () => {
    return request("/api/products");
  },
  fetchProductBySlug: async (slug) => {
    return request(`/api/products/${slug}`);
  },
  submitReview: async (slug, payload) => {
    return request(`/api/products/${slug}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  },
  submitContact: async (payload) => {
    return request("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  },
  createCardCheckoutSession: async (payload) => {
    return request("/api/checkout/card-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  },
  createCashOrder: async (payload) => {
    return request("/api/checkout/cash-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  },
  fetchCheckoutOrder: async (orderNumber) => {
    return request(`/api/checkout/orders/${orderNumber}`);
  },
  fetchCheckoutSessionStatus: async (sessionId) => {
    return request(`/api/checkout/session/${sessionId}`);
  },
  fetchSession: async () => request("/api/auth/session"),
  signup: async (payload) =>
    request("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }),
  login: async (payload) =>
    request("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }),
  logout: async () =>
    request("/api/auth/logout", {
      method: "POST"
    }),
  updateProfile: async (payload) =>
    request("/api/auth/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }),
  changePassword: async (payload) =>
    request("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }),
  forgotPassword: async (payload) =>
    request("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }),
  resetPassword: async (payload) =>
    request("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }),
  verifyEmail: async (payload) =>
    request("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }),
  resendVerification: async () =>
    request("/api/auth/resend-verification", {
      method: "POST"
    }),
  fetchAdminSummary: async () => request("/api/auth/admin/summary"),
  fetchAdminOrders: async (filters = {}) => {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null && value !== "") {
        params.set(key, String(value));
      }
    }

    return request(`/api/auth/admin/orders${params.toString() ? `?${params.toString()}` : ""}`);
  },
  updateAdminOrderStatus: async (orderNumber, payload) =>
    request(`/api/auth/admin/orders/${encodeURIComponent(orderNumber)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }),
  getOAuthUrl: (provider, redirect = "/account") => `/api/auth/${provider}?redirect=${encodeURIComponent(redirect)}`
};
