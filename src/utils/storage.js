const STORAGE_KEY = "padelna-store";

const defaultPersistedState = {
  cart: { items: [] },
  favorites: { items: [] },
  ui: {
    theme: "velocity",
    language: "en",
    cartOpen: false,
    favoritesOpen: false,
    mobileNavOpen: false,
    toast: null
  }
};

export const loadPersistedState = () => {
  if (typeof window === "undefined") {
    return undefined;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return undefined;
    }

    const parsed = JSON.parse(raw);

    return {
      cart: { ...defaultPersistedState.cart, ...(parsed.cart || {}) },
      favorites: { ...defaultPersistedState.favorites, ...(parsed.favorites || {}) },
      ui: { ...defaultPersistedState.ui, ...(parsed.ui || {}) }
    };
  } catch {
    return undefined;
  }
};

export const persistState = (state) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        cart: state.cart,
        favorites: state.favorites,
        ui: { theme: state.ui.theme, language: state.ui.language }
      })
    );
  } catch {
    // ignore persistence errors
  }
};
