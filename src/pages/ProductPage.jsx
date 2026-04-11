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
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [reviewForm, setReviewForm] = useState(initialReview);

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
    return <LoadingBall label="Chargement du produit..." variant="page" />;
  }

  const isFavorite = favorites.includes(activeProduct.slug);

  const handleAddCart = () => {
    dispatch(
      addToCart({
        slug: activeProduct.slug,
        size: selectedSize,
        quantity
      })
    );
    dispatch(showToast({ type: "success", message: `${activeProduct.name} ajoute au panier.` }));
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();

    try {
      await dispatch(submitReview({ slug, payload: reviewForm })).unwrap();
      setReviewForm(initialReview);
      dispatch(showToast({ type: "success", message: "Merci, votre avis a ete ajoute." }));
    } catch (error) {
      dispatch(showToast({ type: "error", message: error.message }));
    }
  };

  return (
    <div className="product-page">
      <section className="section product-detail-layout">
        <Reveal className="product-gallery-column">
          <ProductGallery product={activeProduct} />
        </Reveal>

        <Reveal className="product-summary-column">
          <Link className="back-link" to="/store">
            Retour a la boutique
          </Link>
          <p className="eyebrow">{activeProduct.heroTag}</p>
          <h1>{activeProduct.name}</h1>
          <RatingStars rating={activeProduct.rating} reviewCount={activeProduct.reviewCount} />
          <div className="price-row">
            <strong>{formatCurrency(activeProduct.price)}</strong>
            {activeProduct.previousPrice ? <span>{formatCurrency(activeProduct.previousPrice)}</span> : null}
          </div>
          <p className="product-description-long">{activeProduct.description}</p>

          <div className="meta-grid">
            <article>
              <span>Genre</span>
              <strong>{activeProduct.gender}</strong>
            </article>
            <article>
              <span>Categorie</span>
              <strong>{activeProduct.category}</strong>
            </article>
            <article>
              <span>Stock</span>
              <strong>{activeProduct.inStock ? `${activeProduct.stockCount} disponibles` : "Rupture"}</strong>
            </article>
          </div>

          <div className="detail-block">
            <span>Tailles</span>
            <div className="chip-group">
              {activeProduct.sizes.map((size) => (
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
            <span>Couleurs</span>
            <div className="chip-group muted">
              {activeProduct.colors.map((color) => (
                <button key={color} type="button">
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div className="detail-block">
            <span>Quantite</span>
            <QuantitySelector
              value={quantity}
              onDecrease={() => setQuantity((current) => Math.max(1, current - 1))}
              onIncrease={() => setQuantity((current) => current + 1)}
            />
          </div>

          <div className="detail-actions">
            <button type="button" className="primary-button" onClick={handleAddCart}>
              <Icon name="cart" />
              Ajouter au panier
            </button>
            <button type="button" className="ghost-button" onClick={() => dispatch(toggleFavorite(activeProduct.slug))}>
              <Icon name="heart" filled={isFavorite} />
              {isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
            </button>
          </div>

          <div className="benefit-grid">
            {activeProduct.benefits.map((benefit) => (
              <article key={benefit}>
                <strong>{benefit}</strong>
              </article>
            ))}
          </div>

          <div className="tech-list">
            <span>Technologies et matieres</span>
            <ul>
              {activeProduct.techFeatures.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      <section className="section review-section">
        <div className="review-layout">
          <Reveal className="review-list-card">
            <p className="eyebrow">Avis clients</p>
            <h2>Ce que pensent les joueurs et joueuses de ce produit.</h2>
            <div className="review-list">
              {activeProduct.reviews.map((review, index) => (
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
            <p className="eyebrow">Ajouter un avis</p>
            <h2>Partagez votre retour pour rassurer les prochains clients.</h2>
            {reviewStatus === "loading" ? (
              <div className="loading-surface-overlay">
                <LoadingBall label="Publication de l'avis..." variant="overlay" />
              </div>
            ) : null}
            <form onSubmit={handleReviewSubmit}>
              <label>
                Nom
                <input
                  name="name"
                  value={reviewForm.name}
                  onChange={(event) => setReviewForm((current) => ({ ...current, name: event.target.value }))}
                  required
                />
              </label>
              <label>
                Note
                <StarRatingInput
                  value={reviewForm.rating}
                  onChange={(rating) => setReviewForm((current) => ({ ...current, rating }))}
                />
              </label>
              <label>
                Commentaire
                <textarea
                  name="comment"
                  rows="5"
                  value={reviewForm.comment}
                  onChange={(event) => setReviewForm((current) => ({ ...current, comment: event.target.value }))}
                  required
                />
              </label>
              <button type="submit" className="primary-button review-submit-button" disabled={reviewStatus === "loading"}>
                {reviewStatus === "loading" ? <LoadingBall label="Ajout..." variant="inline" /> : "Publier l'avis"}
              </button>
            </form>
          </Reveal>
        </div>
      </section>

      {relatedProducts.length ? (
        <section className="section section-alt">
          <Reveal>
            <p className="eyebrow">Vous aimerez aussi</p>
            <h2>Des pieces proches du meme esprit.</h2>
          </Reveal>
          <ProductGrid products={relatedProducts} compact />
        </section>
      ) : null}
    </div>
  );
}

export default ProductPage;
