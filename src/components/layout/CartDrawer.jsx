import { useDispatch, useSelector } from "react-redux";
import { formatCurrency } from "../../utils/formatCurrency.js";
import { selectCartDetailedItems, selectCartSummary } from "../../utils/productFilters.js";
import { clearCart, removeFromCart, updateCartQuantity } from "../../features/cartSlice.js";
import { closeDrawers, showToast, toggleCart } from "../../features/uiSlice.js";
import QuantitySelector from "../product/QuantitySelector.jsx";
import Icon from "../ui/Icon.jsx";

function CartDrawer() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.ui.cartOpen);
  const items = useSelector(selectCartDetailedItems);
  const summary = useSelector(selectCartSummary);
  const deliveryFee = summary.quantity ? (summary.total >= 320 ? 0 : 14) : 0;
  const vat = Number((summary.total * 0.19).toFixed(2));
  const grandTotal = summary.total + deliveryFee + vat;

  const handleCheckout = () => {
    dispatch(
      showToast({
        type: "success",
        message: "Panier pret. La prochaine etape peut etre un checkout Stripe ou paiement a la livraison."
      })
    );
    dispatch(closeDrawers());
  };

  return (
    <aside className={`side-drawer cart-drawer ${isOpen ? "open" : ""}`} aria-hidden={!isOpen}>
      <div className="drawer-panel">
        <div className="drawer-header">
          <div>
            <p>Panier</p>
            <h3>{summary.quantity} article(s)</h3>
          </div>
          <button type="button" onClick={() => dispatch(toggleCart())}>
            Fermer
          </button>
        </div>

        <div className="drawer-grid">
          <div className="drawer-body">
            {items.length ? (
              items.map((item) => (
                <article key={`${item.slug}-${item.size || "default"}`} className="drawer-item">
                  <img src={item.product.images[0]?.url} alt={item.product.name} loading="lazy" />
                  <div>
                    <strong>{item.product.name}</strong>
                    <span>{item.size ? `Taille ${item.size}` : "Taille standard"}</span>
                    <small>{formatCurrency(item.product.price)}</small>
                    <small className="drawer-line-total">Sous-total: {formatCurrency(item.subtotal)}</small>
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
                  <button
                    type="button"
                    className="link-button icon-link-button"
                    aria-label="Retirer du panier"
                    onClick={() => dispatch(removeFromCart({ slug: item.slug, size: item.size }))}
                  >
                    <Icon name="trash" />
                  </button>
                </article>
              ))
            ) : (
              <div className="drawer-empty">
                <p>Votre panier est encore vide. Ajoutez une tenue Palina pour demarrer.</p>
              </div>
            )}
          </div>

          <aside className="invoice-card">
            <span>Facture</span>
            <strong>Resume de commande</strong>
            <div className="invoice-lines">
              <div>
                <span>Articles</span>
                <strong>{summary.quantity}</strong>
              </div>
              <div>
                <span>Sous-total</span>
                <strong>{formatCurrency(summary.total)}</strong>
              </div>
              <div>
                <span>Livraison</span>
                <strong>{deliveryFee === 0 ? "Offerte" : formatCurrency(deliveryFee)}</strong>
              </div>
              <div>
                <span>TVA</span>
                <strong>{formatCurrency(vat)}</strong>
              </div>
            </div>
            <div className="invoice-total">
              <span>Total a payer</span>
              <strong>{formatCurrency(grandTotal)}</strong>
            </div>
            <p>Le panier est pret pour une vraie etape checkout plus tard.</p>
            <div className="drawer-footer-actions invoice-actions">
              <button type="button" className="ghost-button" onClick={() => dispatch(clearCart())}>
                Vider
              </button>
              <button type="button" className="primary-button" onClick={handleCheckout} disabled={!items.length}>
                Commander
              </button>
            </div>
          </aside>
        </div>
      </div>
    </aside>
  );
}

export default CartDrawer;
