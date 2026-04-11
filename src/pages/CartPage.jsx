import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Reveal from "../components/sections/Reveal.jsx";
import SectionTitle from "../components/sections/SectionTitle.jsx";
import QuantitySelector from "../components/product/QuantitySelector.jsx";
import Icon from "../components/ui/Icon.jsx";
import LoadingBall from "../components/ui/LoadingBall.jsx";
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
        message: "Cart ready. The next step can be checkout or online payment."
      })
    );
  };

  return (
    <div className="cart-page">
      <section className="section">
        <Reveal>
          <SectionTitle
            eyebrow="Cart"
            title="Your selected products are grouped here."
            copy="Detailed cart items stay on the left, while the invoice summary stays clear on the right."
          />
        </Reveal>

        <div className="cart-page-layout">
          <Reveal className="cart-list-card">
            {isHydratingCart ? (
              <LoadingBall label="Loading your cart..." variant="section" />
            ) : items.length ? (
              <div className="cart-page-items">
                {items.map((item) => (
                  <article key={`${item.slug}-${item.size || "default"}`} className="cart-page-item">
                    <img src={item.product.images[0]?.url} alt={item.product.name} loading="lazy" />
                    <div className="cart-page-copy">
                      <div>
                        <strong>{item.product.name}</strong>
                        <span>{item.product.gender}</span>
                        <small>{item.size ? `Size ${item.size}` : "Standard size"}</small>
                      </div>
                      <div className="cart-page-meta">
                        <small>Unit price: {formatCurrency(item.product.price)}</small>
                        <small>Subtotal: {formatCurrency(item.subtotal)}</small>
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
                      <Link to={`/store/${item.slug}`} className="cart-item-link" aria-label="View product">
                        <Icon name="eye" />
                      </Link>
                      <button
                        type="button"
                        className="icon-link-button"
                        aria-label="Remove from cart"
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
                <p>Your cart is empty for now.</p>
                <Link to="/store" className="primary-button">
                  <Icon name="arrow-left" />
                  Back to store
                </Link>
              </div>
            )}
          </Reveal>

          <Reveal className="cart-summary-card">
            <span>Invoice</span>
            <strong>Order summary</strong>
            <div className="invoice-lines">
              <div>
                <span>Items</span>
                <strong>{isHydratingCart ? rawQuantity : summary.quantity}</strong>
              </div>
              <div>
                <span>Subtotal</span>
                <strong>{isHydratingCart ? "Calculating..." : formatCurrency(summary.total)}</strong>
              </div>
              <div>
                <span>Delivery</span>
                <strong>{isHydratingCart ? "Calculating..." : deliveryFee === 0 ? "Free" : formatCurrency(deliveryFee)}</strong>
              </div>
              <div>
                <span>VAT</span>
                <strong>{isHydratingCart ? "Calculating..." : formatCurrency(vat)}</strong>
              </div>
            </div>
            <div className="invoice-total">
              <span>Total to pay</span>
              <strong>{isHydratingCart ? "Calculating..." : formatCurrency(grandTotal)}</strong>
            </div>
            <p>This box is ready for a future Stripe, PayPal or custom checkout step.</p>
            <div className="cart-summary-actions">
              <button type="button" className="ghost-button" onClick={() => dispatch(clearCart())} disabled={!items.length}>
                <Icon name="trash" />
                Clear cart
              </button>
              <button type="button" className="primary-button" onClick={handleCheckout} disabled={!items.length}>
                <Icon name="arrow-right" />
                Checkout
              </button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

export default CartPage;
