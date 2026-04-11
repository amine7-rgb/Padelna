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
  }
};
