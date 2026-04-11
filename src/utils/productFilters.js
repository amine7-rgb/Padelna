import { createSelector } from "@reduxjs/toolkit";
import { localizeProduct } from "../data/productLocale.js";

const normalize = (value) => String(value || "").toLowerCase();

const matchesText = (product, text, language) => {
  const query = normalize(text).trim();

  if (!query) {
    return true;
  }

  const localizedProduct = localizeProduct(product, language);

  const haystack = [
    localizedProduct.name,
    localizedProduct.gender,
    localizedProduct.category,
    localizedProduct.summary,
    ...(localizedProduct.colors || []),
    ...(localizedProduct.badges || [])
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
};

const sortProducts = (items, sortKey) => {
  const sorted = [...items];

  switch (sortKey) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "newest":
      return sorted.sort((a, b) => Number(b.isNewArrival) - Number(a.isNewArrival));
    default:
      return sorted.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
  }
};

export const selectProductFilters = (state) => state.products.filters;
export const selectAllProducts = (state) => state.products.items;
export const selectFavorites = (state) => state.favorites.items;
export const selectCartItems = (state) => state.cart.items;
export const selectLanguage = (state) => state.ui.language;

export const selectFilteredProducts = createSelector(
  [selectAllProducts, selectProductFilters, selectLanguage],
  (products, filters, language) =>
    sortProducts(
      products.filter((product) => {
        const priceMatch = product.price >= filters.minPrice && product.price <= filters.maxPrice;
        const categoryMatch =
          !filters.categories.length || filters.categories.includes(product.category);
        const genderMatch = !filters.genders.length || filters.genders.includes(product.gender);
        const ratingMatch = product.rating >= filters.rating;
        const stockMatch = filters.inStock ? product.inStock : true;
        const noveltyMatch = filters.newOnly ? product.isNewArrival : true;

        return (
          priceMatch &&
          categoryMatch &&
          genderMatch &&
          ratingMatch &&
          stockMatch &&
          noveltyMatch &&
          matchesText(product, filters.search, language)
        );
      }),
      filters.sort
    )
);

export const selectNewArrivals = createSelector([selectAllProducts], (products) =>
  products.filter((product) => product.isNewArrival).slice(0, 4)
);

export const selectFeaturedProducts = createSelector([selectAllProducts], (products) =>
  products.filter((product) => product.isFeatured).slice(0, 6)
);

export const selectFavoriteProducts = createSelector(
  [selectAllProducts, selectFavorites],
  (products, favorites) => products.filter((product) => favorites.includes(product.slug))
);

export const selectCartDetailedItems = createSelector(
  [selectAllProducts, selectCartItems],
  (products, cartItems) =>
    cartItems
      .map((item) => {
        const product = products.find((entry) => entry.slug === item.slug);

        if (!product) {
          return null;
        }

        return {
          ...item,
          product,
          subtotal: product.price * item.quantity
        };
      })
      .filter(Boolean)
);

export const selectCartSummary = createSelector([selectCartDetailedItems], (items) => {
  const quantity = items.reduce((total, item) => total + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.subtotal, 0);

  return { quantity, total };
});
