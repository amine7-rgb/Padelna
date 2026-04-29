import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite } from "../../features/favoritesSlice.js";
import { addToCart } from "../../features/cartSlice.js";
import { showToast } from "../../features/uiSlice.js";
import { getSiteCopy } from "../../data/siteContent.js";
import { localizeProduct } from "../../data/productLocale.js";
import { formatCurrency } from "../../utils/formatCurrency.js";
import RatingStars from "./RatingStars.jsx";
import Icon from "../ui/Icon.jsx";

function ProductCard({ product, compact = false }) {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.items);
  const language = useSelector((state) => state.ui.language);
  const copy = getSiteCopy(language);
  const localizedProduct = localizeProduct(product, language);
  const isFavorite = favorites.includes(product.slug);

  const handleFavorite = () => {
    dispatch(toggleFavorite(product.slug));
    dispatch(
      showToast({
        type: "info",
        message: isFavorite ? copy.favorites.removedToast : copy.favorites.addedToast
      })
    );
  };

  const handleAddCart = () => {
    dispatch(
      addToCart({
        slug: product.slug,
        size: product.sizes?.[0] || null,
        quantity: 1
      })
    );
    dispatch(showToast({ type: "success", message: `${localizedProduct.name} ${copy.product.addedToCart}` }));
  };

  return (
    <article className={`product-card ${compact ? "compact" : ""}`}>
      <div className="product-image-wrap">
        <div className="product-review-rail">
          <RatingStars rating={product.rating} reviewCount={product.reviewCount} compact />
        </div>
        <img src={product.images[0]?.url} alt={product.images[0]?.alt || localizedProduct.name} loading="lazy" />
        <span className="product-badge">{localizedProduct.heroTag}</span>
      </div>

      <div className="product-actions">
        <button
          type="button"
          className={isFavorite ? "active" : ""}
          onClick={handleFavorite}
          aria-label={isFavorite ? copy.favorites.removeAria : copy.favorites.addAria}
        >
          <Icon name="heart" filled={isFavorite} />
        </button>
        <button type="button" onClick={handleAddCart} aria-label={copy.product.addToCart}>
          <Icon name="cart" />
        </button>
        <Link className="product-icon-link" to={`/store/${product.slug}`} aria-label={copy.favorites.view}>
          <Icon name="eye" />
        </Link>
      </div>

      <div className="product-card-copy">
        <p>{localizedProduct.gender}</p>
        <div className="product-price-stack">
          <strong>{formatCurrency(product.price)}</strong>
          {product.previousPrice ? <span>{formatCurrency(product.previousPrice)}</span> : null}
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
