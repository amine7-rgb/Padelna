import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite } from "../../features/favoritesSlice.js";
import { addToCart } from "../../features/cartSlice.js";
import { showToast } from "../../features/uiSlice.js";
import { formatCurrency } from "../../utils/formatCurrency.js";
import RatingStars from "./RatingStars.jsx";
import Icon from "../ui/Icon.jsx";

function ProductCard({ product, compact = false }) {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.items);
  const isFavorite = favorites.includes(product.slug);

  const handleFavorite = () => {
    dispatch(toggleFavorite(product.slug));
    dispatch(
      showToast({
        type: "info",
        message: isFavorite ? "Product removed from favorites." : "Product added to favorites."
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
    dispatch(showToast({ type: "success", message: `${product.name} added to cart.` }));
  };

  return (
    <article className={`product-card ${compact ? "compact" : ""}`}>
      <Link className="product-image-wrap" to={`/store/${product.slug}`}>
        <img src={product.images[0]?.url} alt={product.images[0]?.alt || product.name} loading="lazy" />
        <span className="product-badge">{product.heroTag}</span>
      </Link>

      <div className="product-actions">
        <button type="button" className={isFavorite ? "active" : ""} onClick={handleFavorite} aria-label="Save to favorites">
          <Icon name="heart" filled={isFavorite} />
        </button>
        <button type="button" onClick={handleAddCart} aria-label="Add to cart">
          <Icon name="cart" />
        </button>
        <Link className="product-icon-link" to={`/store/${product.slug}`} aria-label="View product details">
          <Icon name="eye" />
        </Link>
      </div>

      <div className="product-card-copy">
        <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
        <h3>{product.name}</h3>
        <p>{product.gender}</p>
        <strong>{formatCurrency(product.price)}</strong>
      </div>
    </article>
  );
}

export default ProductCard;
