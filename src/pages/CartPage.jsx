import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Reveal from "../components/sections/Reveal.jsx";
import SectionTitle from "../components/sections/SectionTitle.jsx";
import QuantitySelector from "../components/product/QuantitySelector.jsx";
import Icon from "../components/ui/Icon.jsx";
import LoadingBall from "../components/ui/LoadingBall.jsx";
import { clearCart, removeFromCart, updateCartQuantity } from "../features/cartSlice.js";
import { fetchProducts } from "../features/productsSlice.js";
import { getSiteCopy } from "../data/siteContent.js";
import { localizeProduct } from "../data/productLocale.js";
import { selectCartDetailedItems, selectCartSummary } from "../utils/productFilters.js";
import { formatCurrency } from "../utils/formatCurrency.js";

function CartPage() {
  const dispatch = useDispatch();
  const productsStatus = useSelector((state) => state.products.status);
  const rawCartItems = useSelector((state) => state.cart.items);
  const language = useSelector((state) => state.ui.language);
  const user = useSelector((state) => state.auth.user);
  const items = useSelector(selectCartDetailedItems).map((item) => ({
    ...item,
    product: localizeProduct(item.product, language)
  }));
  const summary = useSelector(selectCartSummary);
  const copy = getSiteCopy(language);
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

  return (
    <div className="cart-page">
      <section className="section">
        <Reveal>
          <SectionTitle
            eyebrow={copy.cart.eyebrow}
            title={copy.cart.title}
            copy={copy.cart.copy}
          />
        </Reveal>

        <div className="cart-page-layout">
          <Reveal className="cart-list-card">
            {isHydratingCart ? (
              <LoadingBall label={copy.cart.loading} variant="section" />
            ) : items.length ? (
              <div className="cart-page-items">
                {items.map((item) => (
                  <article key={`${item.slug}-${item.size || "default"}`} className="cart-page-item">
                    <img src={item.product.images[0]?.url} alt={item.product.name} loading="lazy" />
                    <div className="cart-page-copy">
                      <div>
                        <strong>{item.product.name}</strong>
                        <span>{item.product.gender}</span>
                        <small>{item.size ? `${copy.cart.size} ${item.size}` : copy.cart.standardSize}</small>
                      </div>
                      <div className="cart-page-meta">
                        <small>{copy.cart.unitPrice}: {formatCurrency(item.product.price)}</small>
                        <small>{copy.cart.subtotal}: {formatCurrency(item.subtotal)}</small>
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
                      <Link to={`/store/${item.slug}`} className="cart-item-link" aria-label={copy.cart.viewProduct}>
                        <Icon name="eye" />
                      </Link>
                      <button
                        type="button"
                        className="icon-link-button"
                        aria-label={copy.cart.remove}
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
                <p>{copy.cart.empty}</p>
                <Link to="/store" className="primary-button">
                  <Icon name="arrow-left" />
                  {copy.cart.backToStore}
                </Link>
              </div>
            )}
          </Reveal>

          <Reveal className="cart-summary-card">
            <span>{copy.cart.invoice}</span>
            <strong>{copy.cart.summary}</strong>
            <div className="invoice-lines">
              <div>
                <span>{copy.cart.items}</span>
                <strong>{isHydratingCart ? rawQuantity : summary.quantity}</strong>
              </div>
              <div>
                <span>{copy.cart.subtotal}</span>
                <strong>{isHydratingCart ? copy.cart.calculating : formatCurrency(summary.total)}</strong>
              </div>
              <div>
                <span>{copy.cart.delivery}</span>
                <strong>{isHydratingCart ? copy.cart.calculating : deliveryFee === 0 ? copy.cart.free : formatCurrency(deliveryFee)}</strong>
              </div>
              <div>
                <span>{copy.cart.vat}</span>
                <strong>{isHydratingCart ? copy.cart.calculating : formatCurrency(vat)}</strong>
              </div>
            </div>
            <div className="invoice-total">
              <span>{copy.cart.total}</span>
              <strong>{isHydratingCart ? copy.cart.calculating : formatCurrency(grandTotal)}</strong>
            </div>
            <p>{copy.cart.note}</p>
            <div className="cart-summary-actions">
              <button type="button" className="ghost-button" onClick={() => dispatch(clearCart())} disabled={!items.length}>
                <Icon name="trash" />
                {copy.cart.clear}
              </button>
              <Link
                to={items.length ? (user ? "/checkout" : "/login?redirect=%2Fcheckout") : "#"}
                className={`primary-button ${items.length ? "" : "disabled"}`.trim()}
                aria-disabled={!items.length}
                onClick={(event) => {
                  if (!items.length) {
                    event.preventDefault();
                  }
                }}
              >
                <Icon name="arrow-right" />
                {copy.cart.checkout}
              </Link>
            </div>
            {items.length && !user ? <p className="cart-auth-note">{copy.auth.secureCheckoutMessage}</p> : null}
          </Reveal>
        </div>
      </section>
    </div>
  );
}

export default CartPage;
