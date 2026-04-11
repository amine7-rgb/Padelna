import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    theme: "velocity",
    cartOpen: false,
    favoritesOpen: false,
    mobileNavOpen: false,
    toast: null
  },
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === "velocity" ? "sand" : "velocity";
    },
    toggleCart(state) {
      state.cartOpen = !state.cartOpen;
      if (state.cartOpen) {
        state.favoritesOpen = false;
      }
    },
    toggleFavorites(state) {
      state.favoritesOpen = !state.favoritesOpen;
      if (state.favoritesOpen) {
        state.cartOpen = false;
      }
    },
    closeDrawers(state) {
      state.cartOpen = false;
      state.favoritesOpen = false;
      state.mobileNavOpen = false;
    },
    toggleMobileNav(state) {
      state.mobileNavOpen = !state.mobileNavOpen;
    },
    showToast(state, action) {
      state.toast = action.payload;
    },
    hideToast(state) {
      state.toast = null;
    }
  }
});

export const {
  toggleTheme,
  toggleCart,
  toggleFavorites,
  closeDrawers,
  toggleMobileNav,
  showToast,
  hideToast
} = uiSlice.actions;

export default uiSlice.reducer;
