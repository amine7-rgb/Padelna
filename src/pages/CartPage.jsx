import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Reveal from "../components/sections/Reveal.jsx";
import SectionTitle from "../components/sections/SectionTitle.jsx";
import QuantitySelector from "../components/product/QuantitySelector.jsx";
import Icon from "../components/ui/Icon.jsx";
import { clearCart, removeFromCart, updateCartQuantity } from "../features/cartSlice.js";
import { showToast } from "../features/uiSlice.js";
import { fetchProducts } from "../features/productsSlice.js";
import { selectCartDetailedItems, selectCartSummary } from "../utils/productFilters.js";
import { formatCurrency } from "../utils/formatCurrency.js";

function CartPage() {
  const dispatch = useDispatch();
  const productsStatus = useSelector((state) => state.products.status);
  const rawCartItems = useSelector((state) => state.cart.items);
  const items = useSelector(selectCartDetailedItems);
  const summary = useSelector(selectCartSummary);
  const rawQuantity = rawCartItems.reduce((total, item) => total + item.quantity, 0);
  const isHydratingCart = rawCartItems.length > 0 && items.length === 0 && productsStatus !== "succeeded";
  const deliveryFee = summary.quantity ? (summary.total >= 320 ? 0 : 14) : 0;
  const vat = Number((summary.total * 0.19).toFixed(2));
  const grandTotal = summary.total + deliveryFee + vat;

  useEffect(() => {
    if (productsStatus === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch, productsStatus]);

  const handleCheckout = () => {
    dispatch(
      showToast({
        type: "success",
        message: "Panier pret. La prochaine etape peut etre un checkout ou un paiement en ligne."
      })
    );
  };

  return (
    <div className="cart-page">
      <section className="section">
        <Reveal>
          <SectionTitle
            eyebrow="Panier"
            title="Vos produits selectionnes sont regroupes ici."
            copy="A gauche la liste detaillee du panier, et a droite une facture claire avec le total."
          />
        </Reveal>

        <div className="cart-page-layout">
          <Reveal className="cart-list-card">
            {isHydratingCart ? (
              <div className="empty-state cart-empty-state">
                <p>Chargement des produits du panier...</p>
              </div>
            ) : items.length ? (
              <div className="cart-page-items">
                {items.map((item) => (
                  <article key={`${item.slug}-${item.size || "default"}`} className="cart-page-item">
                    <img src={item.product.images[0]?.url} alt={item.product.name} loading="lazy" />
                    <div className="cart-page-copy">
                      <div>
                        <strong>{item.product.name}</strong>
                        <span>{item.product.gender}</span>
                        <small>{item.size ? `Taille ${item.size}` : "Taille standard"}</small>
                      </div>
                      <div className="cart-page-meta">
                        <small>Prix unitaire: {formatCurrency(item.product.price)}</small>
                        <small>Sous-total: {formatCurrency(item.subtotal)}</small>
                      </div>
                      <QuantitySelector
                        value={item.quantity}
                        onDecrease={() =>
                          dispatch(
                            updateCartQuantity({
                              slug: item.slug,
                              size: item.size,
                              quantity: Math.max(1, item.quantity - 1)
                            })
                          )
                        }
                        onIncrease={() =>
                          dispatch(
                            updateCartQuantity({
                              slug: item.slug,
                              size: item.size,
                              quantity: item.quantity + 1
                            })
                          )
                        }
                      />
                    </div>
                    <div className="cart-page-item-actions">
                      <Link to={`/store/${item.slug}`} className="cart-item-link" aria-label="Voir le produit">
                        <Icon name="eye" />
                      </Link>
                      <button
                        type="button"
                        className="icon-link-button"
                        aria-label="Retirer du panier"
                        onClick={() => dispatch(removeFromCart({ slug: item.slug, size: item.size }))}
                      >
                        <Icon name="trash" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state cart-empty-state">
                <p>Votre panier est vide pour le moment.</p>
                <Link to="/store" className="primary-button">
                  Retour a la boutique
                </Link>
              </div>
            )}
          </Reveal>

          <Reveal className="cart-summary-card">
            <span>Facture</span>
            <strong>Resume de commande</strong>
            <div className="invoice-lines">
              <div>
                <span>Articles</span>
                <strong>{isHydratingCart ? rawQuantity : summary.quantity}</strong>
              </div>
              <div>
                <span>Sous-total</span>
                <strong>{isHydratingCart ? "Calcul..." : formatCurrency(summary.total)}</strong>
              </div>
              <div>
                <span>Livraison</span>
                <strong>{isHydratingCart ? "Calcul..." : deliveryFee === 0 ? "Offerte" : formatCurrency(deliveryFee)}</strong>
              </div>
              <div>
                <span>TVA</span>
                <strong>{isHydratingCart ? "Calcul..." : formatCurrency(vat)}</strong>
              </div>
            </div>
            <div className="invoice-total">
              <span>Total a payer</span>
              <strong>{isHydratingCart ? "Calcul..." : formatCurrency(grandTotal)}</strong>
            </div>
            <p>Ce bloc est pret pour recevoir plus tard Stripe, PayPal ou une etape checkout custom.</p>
            <div className="cart-summary-actions">
              <button type="button" className="ghost-button" onClick={() => dispatch(clearCart())} disabled={!items.length}>
                Vider le panier
              </button>
              <button type="button" className="primary-button" onClick={handleCheckout} disabled={!items.length}>
                Commander
              </button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

export default CartPage;
