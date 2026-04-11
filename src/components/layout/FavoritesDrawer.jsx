import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectFavoriteProducts } from "../../utils/productFilters.js";
import { toggleFavorite } from "../../features/favoritesSlice.js";
import { toggleFavorites } from "../../features/uiSlice.js";
import { getSiteCopy } from "../../data/siteContent.js";
import { localizeProduct } from "../../data/productLocale.js";
import Icon from "../ui/Icon.jsx";

function FavoritesDrawer() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.ui.favoritesOpen);
  const language = useSelector((state) => state.ui.language);
  const favorites = useSelector(selectFavoriteProducts).map((product) => localizeProduct(product, language));
  const copy = getSiteCopy(language);

  return (
    <aside className={`side-drawer favorites-drawer ${isOpen ? "open" : ""}`} aria-hidden={!isOpen}>
      <div className="drawer-panel">
        <div className="drawer-header">
          <div>
            <p>{copy.favorites.label}</p>
            <h3>{favorites.length} {copy.favorites.count}</h3>
          </div>
          <button
            type="button"
            className="drawer-close-button"
            onClick={() => dispatch(toggleFavorites())}
            aria-label={copy.favorites.close}
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
                  <Link to={`/store/${product.slug}`} onClick={() => dispatch(toggleFavorites())} aria-label={copy.favorites.view}>
                    <Icon name="eye" />
                  </Link>
                  <button
                    type="button"
                    className="link-button icon-link-button"
                    aria-label={copy.favorites.remove}
                    onClick={() => dispatch(toggleFavorite(product.slug))}
                  >
                    <Icon name="trash" />
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="drawer-empty">
              <p>{copy.favorites.empty}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

export default FavoritesDrawer;
