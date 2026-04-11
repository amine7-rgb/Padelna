import { createSlice } from "@reduxjs/toolkit";

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    items: []
  },
  reducers: {
    toggleFavorite(state, action) {
      const slug = action.payload;
      state.items = state.items.includes(slug)
        ? state.items.filter((item) => item !== slug)
        : [...state.items, slug];
    }
  }
});

export const { toggleFavorite } = favoritesSlice.actions;

export default favoritesSlice.reducer;

