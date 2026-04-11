import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectFavoriteProducts } from "../../utils/productFilters.js";
import { toggleFavorite } from "../../features/favoritesSlice.js";
import { toggleFavorites } from "../../features/uiSlice.js";
import Icon from "../ui/Icon.jsx";

function FavoritesDrawer() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.ui.favoritesOpen);
  const favorites = useSelector(selectFavoriteProducts);

  return (
    <aside className={`side-drawer favorites-drawer ${isOpen ? "open" : ""}`} aria-hidden={!isOpen}>
      <div className="drawer-panel">
        <div className="drawer-header">
          <div>
            <p>Favorites</p>
            <h3>{favorites.length} product(s)</h3>
          </div>
          <button
            type="button"
            className="drawer-close-button"
            onClick={() => dispatch(toggleFavorites())}
            aria-label="Close favorites"
          >
            <Icon name="close" />
          </button>
        </div>

        <div className="drawer-body">
          {favorites.length ? (
            favorites.map((product) => (
              <article className="drawer-item compact" key={product.slug}>
                <img src={product.images[0]?.url} alt={product.name} loading="lazy" />
                <div>
                  <strong>{product.name}</strong>
                  <span>{product.gender}</span>
                </div>
                <div className="drawer-item-actions">
                  <Link to={`/store/${product.slug}`} onClick={() => dispatch(toggleFavorites())} aria-label="View product">
                    <Icon name="eye" />
                  </Link>
                  <button
                    type="button"
                    className="link-button icon-link-button"
                    aria-label="Remove from favorites"
                    onClick={() => dispatch(toggleFavorite(product.slug))}
                  >
                    <Icon name="trash" />
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="drawer-empty">
              <p>Save your favorite pieces here to find them again in one click.</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

export default FavoritesDrawer;
