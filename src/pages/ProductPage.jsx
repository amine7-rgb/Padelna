import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProductGallery from "../components/product/ProductGallery.jsx";
import ProductGrid from "../components/product/ProductGrid.jsx";
import RatingStars from "../components/product/RatingStars.jsx";
import QuantitySelector from "../components/product/QuantitySelector.jsx";
import StarRatingInput from "../components/product/StarRatingInput.jsx";
import Reveal from "../components/sections/Reveal.jsx";
import { addToCart } from "../features/cartSlice.js";
import { fetchProductBySlug, fetchProducts, submitReview } from "../features/productsSlice.js";
import { toggleFavorite } from "../features/favoritesSlice.js";
import { showToast } from "../features/uiSlice.js";
import { getSiteCopy } from "../data/siteContent.js";
import { localizeProduct } from "../data/productLocale.js";
import { formatCurrency } from "../utils/formatCurrency.js";
import Icon from "../components/ui/Icon.jsx";
import LoadingBall from "../components/ui/LoadingBall.jsx";

const initialReview = {
  name: "",
  rating: 5,
  comment: ""
};

function ProductPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const status = useSelector((state) => state.products.status);
  const activeProduct = useSelector((state) => state.products.activeProduct);
  const activeStatus = useSelector((state) => state.products.activeStatus);
  const reviewStatus = useSelector((state) => state.products.reviewStatus);
  const products = useSelector((state) => state.products.items);
  const favorites = useSelector((state) => state.favorites.items);
  const language = useSelector((state) => state.ui.language);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [reviewForm, setReviewForm] = useState(initialReview);
  const copy = getSiteCopy(language);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }

    dispatch(fetchProductBySlug(slug));
  }, [dispatch, slug, status]);

  useEffect(() => {
    if (activeProduct?.sizes?.length) {
      setSelectedSize(activeProduct.sizes[0]);
    }
  }, [activeProduct]);

  const relatedProducts = useMemo(
    () =>
      products
        .filter((product) => product.slug !== slug && product.category === activeProduct?.category)
        .slice(0, 3),
    [activeProduct?.category, products, slug]
  );

  if (activeStatus === "loading" || !activeProduct) {
    return <LoadingBall label={copy.product.loading} variant="page" />;
  }

  const localizedProduct = localizeProduct(activeProduct, language);
  const isFavorite = favorites.includes(activeProduct.slug);

  const handleAddCart = () => {
    dispatch(
      addToCart({
        slug: activeProduct.slug,
        size: selectedSize,
        quantity
      })
    );
    dispatch(showToast({ type: "success", message: `${localizedProduct.name} ${copy.product.addedToCart}` }));
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();

    try {
      await dispatch(submitReview({ slug, payload: reviewForm })).unwrap();
      setReviewForm(initialReview);
      dispatch(showToast({ type: "success", message: copy.product.reviewAdded }));
    } catch (error) {
      dispatch(showToast({ type: "error", message: error.message }));
    }
  };

  return (
    <div className="product-page">
      <section className="section product-detail-layout">
        <Reveal className="product-gallery-column">
          <ProductGallery product={localizedProduct} />
        </Reveal>

        <Reveal className="product-summary-column">
          <Link className="back-link" to="/store">
            <Icon name="arrow-left" />
            {copy.product.backToStore}
          </Link>
          <p className="eyebrow">{localizedProduct.heroTag}</p>
          <h1>{localizedProduct.name}</h1>
          <RatingStars rating={localizedProduct.rating} reviewCount={localizedProduct.reviewCount} />
          <div className="price-row">
            <strong>{formatCurrency(localizedProduct.price)}</strong>
            {localizedProduct.previousPrice ? <span>{formatCurrency(localizedProduct.previousPrice)}</span> : null}
          </div>
          <p className="product-description-long">{localizedProduct.description}</p>

          <div className="meta-grid">
            <article>
              <span>{copy.product.gender}</span>
              <strong>{localizedProduct.gender}</strong>
            </article>
            <article>
              <span>{copy.product.category}</span>
              <strong>{localizedProduct.category}</strong>
            </article>
            <article>
              <span>{copy.product.stock}</span>
              <strong>
                {localizedProduct.inStock
                  ? `${localizedProduct.stockCount} ${copy.product.available}`
                  : copy.product.soldOut}
              </strong>
            </article>
          </div>

          <div className="detail-block">
            <span>{copy.product.sizes}</span>
            <div className="chip-group">
              {localizedProduct.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={selectedSize === size ? "active" : ""}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="detail-block">
            <span>{copy.product.colors}</span>
            <div className="chip-group muted">
              {localizedProduct.colors.map((color) => (
                <button key={color} type="button">
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div className="detail-block">
            <span>{copy.product.quantity}</span>
            <QuantitySelector
              value={quantity}
              onDecrease={() => setQuantity((current) => Math.max(1, current - 1))}
              onIncrease={() => setQuantity((current) => current + 1)}
            />
          </div>

          <div className="detail-actions">
            <button type="button" className="primary-button" onClick={handleAddCart}>
              <Icon name="cart" />
              {copy.product.addToCart}
            </button>
            <button type="button" className="ghost-button" onClick={() => dispatch(toggleFavorite(activeProduct.slug))}>
              <Icon name="heart" filled={isFavorite} />
              {isFavorite ? copy.product.removeFavorite : copy.product.saveFavorite}
            </button>
          </div>

          <div className="benefit-grid">
            {localizedProduct.benefits.map((benefit) => (
              <article key={benefit}>
                <strong>{benefit}</strong>
              </article>
            ))}
          </div>

          <div className="tech-list">
            <span>{copy.product.fabricTech}</span>
            <ul>
              {localizedProduct.techFeatures.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      <section className="section review-section">
        <div className="review-layout">
          <Reveal className="review-list-card">
            <p className="eyebrow">{copy.product.reviewsEyebrow}</p>
            <h2>{copy.product.reviewsTitle}</h2>
            <div className="review-list">
              {localizedProduct.reviews.map((review, index) => (
                <article key={`${review.name}-${index}`}>
                  <div className="review-head">
                    <strong>{review.name}</strong>
                    <RatingStars rating={Number(review.rating)} />
                  </div>
                  <p>{review.comment}</p>
                </article>
              ))}
            </div>
          </Reveal>

          <Reveal className={`review-form-card ${reviewStatus === "loading" ? "loading-surface" : ""}`}>
            <p className="eyebrow">{copy.product.addReviewEyebrow}</p>
            <h2>{copy.product.addReviewTitle}</h2>
            {reviewStatus === "loading" ? (
              <div className="loading-surface-overlay">
                <LoadingBall label={copy.product.publishing} variant="overlay" />
              </div>
            ) : null}
            <form onSubmit={handleReviewSubmit}>
              <label>
                {copy.product.name}
                <input
                  name="name"
                  value={reviewForm.name}
                  onChange={(event) => setReviewForm((current) => ({ ...current, name: event.target.value }))}
                  required
                />
              </label>
              <label>
                {copy.product.rating}
                <StarRatingInput
                  value={reviewForm.rating}
                  onChange={(rating) => setReviewForm((current) => ({ ...current, rating }))}
                />
              </label>
              <label className="wide">
                {copy.product.comment}
                <textarea
                  name="comment"
                  rows="5"
                  value={reviewForm.comment}
                  onChange={(event) => setReviewForm((current) => ({ ...current, comment: event.target.value }))}
                  required
                />
              </label>
              <div className="form-action-row wide">
                <button type="submit" className="primary-button review-submit-button" disabled={reviewStatus === "loading"}>
                  {reviewStatus === "loading" ? (
                    <LoadingBall label={copy.product.sending} variant="inline" />
                  ) : (
                    <>
                      <Icon name="send" />
                      {copy.product.publishReview}
                    </>
                  )}
                </button>
              </div>
            </form>
          </Reveal>
        </div>
      </section>

      {relatedProducts.length ? (
        <section className="section section-alt">
          <Reveal>
            <p className="eyebrow">{copy.product.youMayAlsoLike}</p>
            <h2>{copy.product.morePieces}</h2>
          </Reveal>
          <ProductGrid products={relatedProducts} compact />
        </section>
      ) : null}
    </div>
  );
}

export default ProductPage;
