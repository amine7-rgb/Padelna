import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "../features/productsSlice.js";
import cartReducer from "../features/cartSlice.js";
import favoritesReducer from "../features/favoritesSlice.js";
import uiReducer from "../features/uiSlice.js";
import { loadPersistedState, persistState } from "../utils/storage.js";

const preloadedState = loadPersistedState();

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    favorites: favoritesReducer,
    ui: uiReducer
  },
  preloadedState
});

store.subscribe(() => {
  persistState(store.getState());
});

