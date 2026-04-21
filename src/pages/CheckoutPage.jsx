import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Reveal from "../components/sections/Reveal.jsx";
import SectionTitle from "../components/sections/SectionTitle.jsx";
import LoadingBall from "../components/ui/LoadingBall.jsx";
import Icon from "../components/ui/Icon.jsx";
import { clearCart } from "../features/cartSlice.js";
import { fetchProducts } from "../features/productsSlice.js";
import { showToast } from "../features/uiSlice.js";
import { getSiteCopy } from "../data/siteContent.js";
import { localizeProduct } from "../data/productLocale.js";
import { api } from "../services/api.js";
import { selectCartDetailedItems, selectCartSummary } from "../utils/productFilters.js";
import { formatCurrency } from "../utils/formatCurrency.js";

const initialCustomer = {
  name: "",
  email: "",
  phone: "",
  addressLine1: "",
  city: "",
  postalCode: "",
  notes: ""
};

function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const language = useSelector((state) => state.ui.language);
  const productsStatus = useSelector((state) => state.products.status);
  const user = useSelector((state) => state.auth.user);
  const rawCartItems = useSelector((state) => state.cart.items);
  const items = useSelector(selectCartDetailedItems).map((item) => ({
    ...item,
    product: localizeProduct(item.product, language)
  }));
  const summary = useSelector(selectCartSummary);
  const copy = getSiteCopy(language);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [customer, setCustomer] = useState(initialCustomer);
  const [submitting, setSubmitting] = useState(false);
  const isHydratingCart = rawCartItems.length > 0 && items.length === 0 && productsStatus !== "succeeded";
  const deliveryFee = summary.quantity ? (summary.total >= 320 ? 0 : 14) : 0;
  const vat = Number((summary.total * 0.19).toFixed(2));
  const grandTotal = summary.total + deliveryFee + vat;
  const paymentOptions = useMemo(
    () => [
      {
        id: "card",
        icon: "credit-card",
        title: copy.checkout.cardTitle,
        copy: copy.checkout.cardCopy,
        hint: copy.checkout.cardHint
      },
      {
        id: "cash_on_delivery",
        icon: "cash",
        title: copy.checkout.cashTitle,
        copy: copy.checkout.cashCopy,
        hint: copy.checkout.cashHint
      }
    ],
    [copy.checkout.cardCopy, copy.checkout.cardHint, copy.checkout.cardTitle, copy.checkout.cashCopy, copy.checkout.cashHint, copy.checkout.cashTitle]
  );

  useEffect(() => {
    if (productsStatus === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch, productsStatus]);

  useEffect(() => {
    if (!user) {
      return;
    }

    setCustomer((current) => ({
      ...current,
      name: current.name || user.fullName || `${user.firstName} ${user.lastName}`.trim(),
      email: current.email || user.email || "",
      phone: current.phone || user.phone || "",
      addressLine1: current.addressLine1 || user.addressLine1 || "",
      city: current.city || user.city || "",
      postalCode: current.postalCode || user.postalCode || ""
    }));
  }, [user]);

  const handleChange = (event) => {
    setCustomer((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      if (paymentMethod === "card") {
        const response = await api.createCardCheckoutSession({
          customer,
          cartItems: rawCartItems
        });

        window.location.assign(response.checkoutUrl);
        return;
      }

      const response = await api.createCashOrder({
        customer,
        cartItems: rawCartItems
      });

      dispatch(clearCart());
      navigate(`/checkout/success?order=${encodeURIComponent(response.order.orderNumber)}&method=cash_on_delivery`);
    } catch (error) {
      dispatch(showToast({ type: "error", message: error.message }));
      setSubmitting(false);
    }
  };

  if (isHydratingCart) {
    return <LoadingBall label={copy.checkout.loadingOrder} variant="page" />;
  }

  if (!rawCartItems.length) {
    return (
      <section className="section checkout-empty">
        <SectionTitle eyebrow={copy.checkout.eyebrow} title={copy.checkout.title} copy={copy.checkout.empty} />
        <div className="hero-actions">
          <Link to="/cart" className="ghost-button">
            <Icon name="arrow-left" />
            {copy.checkout.backToCart}
          </Link>
          <Link to="/store" className="primary-button">
            <Icon name="shop" />
            {copy.checkout.continueShopping}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="checkout-page">
      <section className="section">
        <Reveal>
          <SectionTitle eyebrow={copy.checkout.eyebrow} title={copy.checkout.title} copy={copy.checkout.copy} />
        </Reveal>

        <div className="checkout-layout">
          <Reveal className={`checkout-form-card ${submitting ? "loading-surface" : ""}`}>
            {submitting ? (
              <div className="loading-surface-overlay">
                <LoadingBall
                  label={paymentMethod === "card" ? copy.checkout.processingCard : copy.checkout.placingCash}
                  variant="overlay"
                />
              </div>
            ) : null}

            <form className="checkout-form-grid" onSubmit={handleSubmit}>
              <div className="checkout-panel-header">
                <span>{copy.checkout.customerTitle}</span>
                <strong>{copy.checkout.customerCopy}</strong>
              </div>

              <label>
                {copy.checkout.fullName}
                <input name="name" value={customer.name} onChange={handleChange} required />
              </label>

              <label>
                {copy.checkout.email}
                <input name="email" type="email" value={customer.email} onChange={handleChange} required />
              </label>

              <label>
                {copy.checkout.phone}
                <input name="phone" type="tel" value={customer.phone} onChange={handleChange} required />
              </label>

              <label>
                {copy.checkout.city}
                <input name="city" value={customer.city} onChange={handleChange} required />
              </label>

              <label className="wide">
                {copy.checkout.address}
                <input name="addressLine1" value={customer.addressLine1} onChange={handleChange} required />
              </label>

              <label>
                {copy.checkout.postalCode}
                <input name="postalCode" value={customer.postalCode} onChange={handleChange} />
              </label>

              <label className="wide">
                {copy.checkout.notes}
                <textarea
                  name="notes"
                  rows="4"
                  value={customer.notes}
                  onChange={handleChange}
                  placeholder={copy.checkout.notesPlaceholder}
                />
              </label>

              <div className="checkout-panel-header wide">
                <span>{copy.checkout.paymentTitle}</span>
                <strong>{copy.checkout.paymentCopy}</strong>
              </div>

              <div className="checkout-method-grid wide">
                {paymentOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={`checkout-method-card ${paymentMethod === option.id ? "active" : ""}`}
                    onClick={() => setPaymentMethod(option.id)}
                  >
                    <span className="checkout-method-icon">
                      <Icon name={option.icon} />
                    </span>
                    <span className="checkout-method-copy">
                      <strong>{option.title}</strong>
                      <small>{option.copy}</small>
                      <em>{option.hint}</em>
                    </span>
                  </button>
                ))}
              </div>

              <div className="checkout-actions wide">
                <Link to="/cart" className="ghost-button">
                  <Icon name="arrow-left" />
                  {copy.checkout.backToCart}
                </Link>
                <button type="submit" className="primary-button">
                  <Icon name={paymentMethod === "card" ? "credit-card" : "cash"} />
                  {paymentMethod === "card" ? copy.checkout.payWithCard : copy.checkout.placeCashOrder}
                </button>
              </div>
            </form>
          </Reveal>

          <Reveal className="checkout-summary-card">
            <span>{copy.checkout.reviewTitle}</span>
            <strong>{copy.cart.summary}</strong>
            <p>{copy.checkout.reviewCopy}</p>

            <div className="checkout-summary-items">
              {items.map((item) => (
                <article key={`${item.slug}-${item.size || "default"}`} className="checkout-summary-item">
                  <img src={item.product.images[0]?.url} alt={item.product.name} loading="lazy" />
                  <div>
                    <strong>{item.product.name}</strong>
                    <small>{item.size ? `${copy.cart.size} ${item.size}` : copy.cart.standardSize}</small>
                    <span>{item.quantity} x {formatCurrency(item.product.price)}</span>
                  </div>
                  <strong>{formatCurrency(item.subtotal)}</strong>
                </article>
              ))}
            </div>

            <div className="invoice-lines">
              <div>
                <span>{copy.cart.items}</span>
                <strong>{summary.quantity}</strong>
              </div>
              <div>
                <span>{copy.cart.subtotal}</span>
                <strong>{formatCurrency(summary.total)}</strong>
              </div>
              <div>
                <span>{copy.cart.delivery}</span>
                <strong>{deliveryFee === 0 ? copy.cart.free : formatCurrency(deliveryFee)}</strong>
              </div>
              <div>
                <span>{copy.cart.vat}</span>
                <strong>{formatCurrency(vat)}</strong>
              </div>
            </div>

            <div className="invoice-total">
              <span>{copy.cart.total}</span>
              <strong>{formatCurrency(grandTotal)}</strong>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

export default CheckoutPage;
