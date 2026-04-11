import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../services/api.js";

const initialFilters = {
  search: "",
  categories: [],
  genders: [],
  sort: "featured",
  minPrice: 0,
  maxPrice: 300,
  inStock: false,
  rating: 0,
  newOnly: false
};

export const fetchProducts = createAsyncThunk("products/fetchAll", async () => {
  const data = await api.fetchProducts();
  return data.products;
});

export const fetchProductBySlug = createAsyncThunk("products/fetchBySlug", async (slug) => {
  const data = await api.fetchProductBySlug(slug);
  return data.product;
});

export const submitReview = createAsyncThunk("products/submitReview", async ({ slug, payload }) => {
  const data = await api.submitReview(slug, payload);
  return data.product;
});

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    status: "idle",
    error: null,
    activeProduct: null,
    activeStatus: "idle",
    reviewStatus: "idle",
    priceBounds: { min: 0, max: 300 },
    filters: initialFilters,
    filtersReady: false
  },
  reducers: {
    setSearchFilter(state, action) {
      state.filters.search = action.payload;
    },
    toggleCategoryFilter(state, action) {
      const category = action.payload;
      state.filters.categories = state.filters.categories.includes(category)
        ? state.filters.categories.filter((item) => item !== category)
        : [...state.filters.categories, category];
    },
    toggleGenderFilter(state, action) {
      const gender = action.payload;
      state.filters.genders = state.filters.genders.includes(gender)
        ? state.filters.genders.filter((item) => item !== gender)
        : [...state.filters.genders, gender];
    },
    setSortFilter(state, action) {
      state.filters.sort = action.payload;
    },
    setPriceFilter(state, action) {
      const { minPrice, maxPrice } = action.payload;
      state.filters.minPrice = Number(minPrice);
      state.filters.maxPrice = Number(maxPrice);
    },
    toggleInStockFilter(state) {
      state.filters.inStock = !state.filters.inStock;
    },
    setRatingFilter(state, action) {
      state.filters.rating = action.payload;
    },
    toggleNewOnlyFilter(state) {
      state.filters.newOnly = !state.filters.newOnly;
    },
    clearFilters(state) {
      state.filters = {
        ...initialFilters,
        minPrice: state.priceBounds.min,
        maxPrice: state.priceBounds.max
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;

        const prices = action.payload.map((product) => product.price);
        const minPrice = prices.length ? Math.min(...prices) : 0;
        const maxPrice = prices.length ? Math.max(...prices) : 300;
        state.priceBounds = { min: minPrice, max: maxPrice };

        if (!state.filtersReady) {
          state.filters.minPrice = minPrice;
          state.filters.maxPrice = maxPrice;
          state.filtersReady = true;
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchProductBySlug.pending, (state) => {
        state.activeStatus = "loading";
        state.error = null;
      })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.activeStatus = "succeeded";
        state.activeProduct = action.payload;

        const match = state.items.findIndex((product) => product.slug === action.payload.slug);

        if (match >= 0) {
          state.items[match] = action.payload;
        }
      })
      .addCase(fetchProductBySlug.rejected, (state, action) => {
        state.activeStatus = "failed";
        state.error = action.error.message;
      })
      .addCase(submitReview.pending, (state) => {
        state.reviewStatus = "loading";
        state.error = null;
      })
      .addCase(submitReview.fulfilled, (state, action) => {
        state.reviewStatus = "succeeded";
        state.activeProduct = action.payload;

        const match = state.items.findIndex((product) => product.slug === action.payload.slug);

        if (match >= 0) {
          state.items[match] = action.payload;
        }
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.reviewStatus = "failed";
        state.error = action.error.message;
      });
  }
});

export const {
  setSearchFilter,
  toggleCategoryFilter,
  toggleGenderFilter,
  setSortFilter,
  setPriceFilter,
  toggleInStockFilter,
  setRatingFilter,
  toggleNewOnlyFilter,
  clearFilters
} = productsSlice.actions;

export default productsSlice.reducer;

