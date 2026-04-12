const parseResponse = async (response) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong.");
  }

  return data;
};

export const api = {
  fetchProducts: async () => {
    const response = await fetch("/api/products");
    return parseResponse(response);
  },
  fetchProductBySlug: async (slug) => {
    const response = await fetch(`/api/products/${slug}`);
    return parseResponse(response);
  },
  submitReview: async (slug, payload) => {
    const response = await fetch(`/api/products/${slug}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return parseResponse(response);
  },
  submitContact: async (payload) => {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return parseResponse(response);
  },
  createCardCheckoutSession: async (payload) => {
    const response = await fetch("/api/checkout/card-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return parseResponse(response);
  },
  createCashOrder: async (payload) => {
    const response = await fetch("/api/checkout/cash-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return parseResponse(response);
  },
  fetchCheckoutOrder: async (orderNumber) => {
    const response = await fetch(`/api/checkout/orders/${orderNumber}`);
    return parseResponse(response);
  },
  fetchCheckoutSessionStatus: async (sessionId) => {
    const response = await fetch(`/api/checkout/session/${sessionId}`);
    return parseResponse(response);
  }
};
