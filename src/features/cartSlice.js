import { createSlice } from "@reduxjs/toolkit";

const findItemIndex = (items, incoming) =>
  items.findIndex((item) => item.slug === incoming.slug && item.size === incoming.size);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: []
  },
  reducers: {
    addToCart(state, action) {
      const product = action.payload;
      const index = findItemIndex(state.items, product);

      if (index >= 0) {
        state.items[index].quantity += product.quantity || 1;
        return;
      }

      state.items.push({
        slug: product.slug,
        size: product.size || null,
        quantity: product.quantity || 1
      });
    },
    removeFromCart(state, action) {
      const { slug, size } = action.payload;
      state.items = state.items.filter((item) => !(item.slug === slug && item.size === size));
    },
    updateCartQuantity(state, action) {
      const { slug, size, quantity } = action.payload;
      const item = state.items.find((entry) => entry.slug === slug && entry.size === size);

      if (!item) {
        return;
      }

      item.quantity = Math.max(1, quantity);
    },
    clearCart(state) {
      state.items = [];
    }
  }
});

export const { addToCart, removeFromCart, updateCartQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;

