import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Reveal from "../components/sections/Reveal.jsx";
import SectionTitle from "../components/sections/SectionTitle.jsx";
import LoadingBall from "../components/ui/LoadingBall.jsx";
import Icon from "../components/ui/Icon.jsx";
import { clearCart } from "../features/cartSlice.js";
import { getSiteCopy } from "../data/siteContent.js";
import { api } from "../services/api.js";
import { formatCurrency } from "../utils/formatCurrency.js";

const formatCheckoutStatus = (copy, order, session) => {
  if (!order) {
    return null;
  }

  const paymentMethod =
    order.paymentMethod === "cash_on_delivery" ? copy.checkout.cashMethodLabel : copy.checkout.cardMethodLabel;

  const paymentStatus =
    session?.paymentStatus === "paid" || order.paymentStatus === "paid"
      ? copy.checkout.paidStatus
      : order.paymentStatus === "cash_due"
        ? copy.checkout.cashDueStatus
        : order.paymentStatus === "failed"
          ? copy.checkout.cancelledStatus
          : copy.checkout.awaitingStatus;

  const orderStatus =
    order.orderStatus === "confirmed"
      ? copy.checkout.confirmedStatus
      : order.orderStatus === "cancelled"
        ? copy.checkout.cancelledStatus
        : copy.checkout.awaitingStatus;

  return { paymentMethod, paymentStatus, orderStatus };
};

function CheckoutStatusPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { status } = useParams();
  const language = useSelector((state) => state.ui.language);
  const copy = getSiteCopy(language);
  const [loading, setLoading] = useState(status === "success");
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);
  const [session, setSession] = useState(null);
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const sessionId = searchParams.get("session_id");
  const orderNumber = searchParams.get("order");
  const paymentMethod = searchParams.get("method");

  useEffect(() => {
    if (status !== "success") {
      setLoading(false);
      return;
    }

    let ignore = false;

    const load = async () => {
      try {
        if (sessionId) {
          const response = await api.fetchCheckoutSessionStatus(sessionId);
          if (ignore) {
            return;
          }
          setOrder(response.order);
          setSession(response.session);
          dispatch(clearCart());
          return;
        }

        if (orderNumber) {
          const response = await api.fetchCheckoutOrder(orderNumber);
          if (ignore) {
            return;
          }
          setOrder(response.order);
          dispatch(clearCart());
          return;
        }

        setError(copy.checkout.missingDetails);
      } catch (loadError) {
        if (!ignore) {
          setError(loadError.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      ignore = true;
    };
  }, [copy.checkout.missingDetails, dispatch, orderNumber, sessionId, status]);

  if (loading) {
    return <LoadingBall label={copy.checkout.loadingOrder} variant="page" />;
  }

  const isSuccess = status === "success";
  const resolvedMethod = order?.paymentMethod || paymentMethod || "card";
  const statusLabels = formatCheckoutStatus(copy, order, session);
  const heading = isSuccess
    ? resolvedMethod === "cash_on_delivery"
      ? copy.checkout.successTitleCash
      : copy.checkout.successTitleCard
    : copy.checkout.cancelTitle;
  const body = isSuccess
    ? resolvedMethod === "cash_on_delivery"
      ? copy.checkout.successCopyCash
      : copy.checkout.successCopyCard
    : copy.checkout.cancelCopy;

  return (
    <section className="section checkout-status-page">
      <Reveal className="checkout-status-card">
        <span className={`checkout-status-icon ${isSuccess ? "success" : "cancelled"}`}>
          <Icon name={isSuccess ? "check-circle" : "alert-circle"} />
        </span>
        <SectionTitle eyebrow={copy.checkout.eyebrow} title={heading} copy={error || body} align="center" />

        {isSuccess && order && statusLabels ? (
          <div className="checkout-status-meta">
            <article>
              <span>{copy.checkout.orderNumber}</span>
              <strong>{order.orderNumber}</strong>
            </article>
            <article>
              <span>{copy.checkout.paymentMethod}</span>
              <strong>{statusLabels.paymentMethod}</strong>
            </article>
            <article>
              <span>{copy.checkout.paymentStatus}</span>
              <strong>{statusLabels.paymentStatus}</strong>
            </article>
            <article>
              <span>{copy.checkout.orderStatus}</span>
              <strong>{statusLabels.orderStatus}</strong>
            </article>
            <article>
              <span>{copy.cart.total}</span>
              <strong>{formatCurrency(order.totals.totalTnd)}</strong>
            </article>
          </div>
        ) : null}

        <div className="hero-actions checkout-status-actions">
          <Link to={isSuccess ? "/store" : "/checkout"} className="primary-button">
            <Icon name={isSuccess ? "shop" : "arrow-left"} />
            {isSuccess ? copy.checkout.continueShopping : copy.checkout.returnCheckout}
          </Link>
          <Link to="/cart" className="ghost-button">
            <Icon name="cart" />
            {copy.checkout.backToCart}
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

export default CheckoutStatusPage;
