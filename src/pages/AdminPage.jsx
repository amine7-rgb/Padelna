import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Reveal from "../components/sections/Reveal.jsx";
import SectionTitle from "../components/sections/SectionTitle.jsx";
import Icon from "../components/ui/Icon.jsx";
import LoadingBall from "../components/ui/LoadingBall.jsx";
import { getSiteCopy } from "../data/siteContent.js";
import { fetchAdminOrders, fetchAdminSummary, updateAdminOrderStatus } from "../features/authSlice.js";
import { showToast } from "../features/uiSlice.js";
import { formatCurrency } from "../utils/formatCurrency.js";

const PAGE_SIZE = 8;

const initialFilters = {
  orderNumber: "",
  paymentMethod: "",
  paymentStatus: "",
  orderStatus: "",
  dateFrom: "",
  dateTo: "",
  sort: "newest"
};

const formatAdminDate = (value, language) =>
  new Date(value).toLocaleString(language === "fr" ? "fr-FR" : "en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

function AdminPage() {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.ui.language);
  const summary = useSelector((state) => state.auth.adminSummary);
  const adminOrders = useSelector((state) => state.auth.adminOrders);
  const adminOrdersPagination = useSelector((state) => state.auth.adminOrdersPagination);
  const adminOrdersStatus = useSelector((state) => state.auth.adminOrdersStatus);
  const actionStatus = useSelector((state) => state.auth.actionStatus);
  const copy = getSiteCopy(language);
  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const [statusDrafts, setStatusDrafts] = useState({});
  const [updatingOrderNumber, setUpdatingOrderNumber] = useState("");
  const [statusModalOrderNumber, setStatusModalOrderNumber] = useState("");

  useEffect(() => {
    dispatch(fetchAdminSummary());
  }, [dispatch]);

  const currentQuery = useMemo(
    () => ({
      ...appliedFilters,
      page,
      pageSize: PAGE_SIZE
    }),
    [appliedFilters, page]
  );

  useEffect(() => {
    dispatch(fetchAdminOrders(currentQuery));
  }, [currentQuery, dispatch]);

  useEffect(() => {
    setStatusDrafts(
      Object.fromEntries(
        adminOrders.map((order) => [
          order.orderNumber,
          {
            paymentStatus: order.paymentStatus,
            orderStatus: order.orderStatus
          }
        ])
      )
    );
  }, [adminOrders]);

  const statCards = useMemo(() => {
    if (!summary) {
      return [];
    }

    return [
      {
        key: "users",
        label: copy.auth.totalUsers,
        value: summary.users,
        icon: "user"
      },
      {
        key: "orders",
        label: copy.auth.totalOrders,
        value: summary.orders,
        icon: "cart"
      },
      {
        key: "gross",
        label: copy.auth.grossRevenue,
        value: formatCurrency(summary.grossRevenue || 0),
        icon: "spark"
      },
      {
        key: "average",
        label: copy.auth.averageOrderValue,
        value: formatCurrency(summary.averageOrderValue || 0),
        icon: "credit-card"
      }
    ];
  }, [copy.auth.averageOrderValue, copy.auth.grossRevenue, copy.auth.totalOrders, copy.auth.totalUsers, summary]);

  const paymentSplit = useMemo(() => {
    const card = summary?.paymentMix?.card || 0;
    const cash = summary?.paymentMix?.cash_on_delivery || 0;
    const total = card + cash || 1;

    return {
      card,
      cash,
      cardPercent: Math.round((card / total) * 100),
      cashPercent: Math.round((cash / total) * 100)
    };
  }, [summary]);

  const statusModalOrder = useMemo(
    () => adminOrders.find((order) => order.orderNumber === statusModalOrderNumber) || null,
    [adminOrders, statusModalOrderNumber]
  );

  const trend = summary?.trend || [];
  const maxTrendOrders = Math.max(...trend.map((item) => item.orders), 1);

  const paymentMethodOptions = [
    { value: "", label: copy.auth.filterAllMethods },
    { value: "card", label: copy.checkout.cardTitle },
    { value: "cash_on_delivery", label: copy.checkout.cashTitle }
  ];

  const paymentStatusOptions = [
    { value: "", label: copy.auth.filterAllPaymentStatuses },
    { value: "pending", label: copy.auth.paymentPending },
    { value: "cash_due", label: copy.auth.paymentCashPending },
    { value: "paid", label: copy.auth.paymentPaid },
    { value: "failed", label: copy.auth.paymentFailed },
    { value: "cancelled", label: copy.auth.paymentCancelled }
  ];

  const orderStatusOptions = [
    { value: "", label: copy.auth.filterAllOrderStatuses },
    { value: "awaiting_payment", label: copy.auth.statusAwaitingPayment },
    { value: "confirmed", label: copy.auth.statusConfirmed },
    { value: "preparing", label: copy.auth.statusPreparing },
    { value: "delivered", label: copy.auth.statusDelivered },
    { value: "returned", label: copy.auth.statusReturned },
    { value: "blocked", label: copy.auth.statusBlocked },
    { value: "cancelled", label: copy.auth.statusCancelled }
  ];

  const paymentMethodLabel = (method) => {
    if (method === "card") {
      return copy.checkout.cardTitle;
    }

    return copy.checkout.cashTitle;
  };

  const paymentStatusLabel = (status) =>
    (
      {
        paid: copy.auth.paymentPaid,
        pending: copy.auth.paymentPending,
        failed: copy.auth.paymentFailed,
        cash_due: copy.auth.paymentCashPending,
        cancelled: copy.auth.paymentCancelled
      }[status] || status
    );

  const orderStatusLabel = (status) =>
    (
      {
        awaiting_payment: copy.auth.statusAwaitingPayment,
        confirmed: copy.auth.statusConfirmed,
        preparing: copy.auth.statusPreparing,
        delivered: copy.auth.statusDelivered,
        returned: copy.auth.statusReturned,
        blocked: copy.auth.statusBlocked,
        cancelled: copy.auth.statusCancelled
      }[status] || status
    );

  const handleFilterChange = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const handleApplyFilters = (event) => {
    event.preventDefault();
    setPage(1);
    setAppliedFilters(filters);
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
    setPage(1);
  };

  const handleDraftChange = (orderNumber, key, value) => {
    setStatusDrafts((current) => ({
      ...current,
      [orderNumber]: {
        ...current[orderNumber],
        [key]: value
      }
    }));
  };

  const handleOpenStatusModal = (orderNumber) => {
    setStatusModalOrderNumber(orderNumber);
  };

  const handleCloseStatusModal = () => {
    if (actionStatus === "loading" && updatingOrderNumber === statusModalOrderNumber) {
      return;
    }

    setStatusModalOrderNumber("");
  };

  const handleSaveStatuses = async (order) => {
    const draft = statusDrafts[order.orderNumber];

    if (!draft) {
      return;
    }

    if (draft.paymentStatus === order.paymentStatus && draft.orderStatus === order.orderStatus) {
      dispatch(showToast({ type: "success", message: copy.auth.statusSaved }));
      return;
    }

    setUpdatingOrderNumber(order.orderNumber);

    try {
      await dispatch(
        updateAdminOrderStatus({
          orderNumber: order.orderNumber,
          payload: {
            paymentStatus: draft.paymentStatus,
            orderStatus: draft.orderStatus
          }
        })
      ).unwrap();

      await Promise.all([dispatch(fetchAdminSummary()), dispatch(fetchAdminOrders(currentQuery))]);
      dispatch(showToast({ type: "success", message: copy.auth.statusSaved }));
      setStatusModalOrderNumber("");
    } catch (error) {
      dispatch(showToast({ type: "error", message: error.message }));
    } finally {
      setUpdatingOrderNumber("");
    }
  };

  return (
    <div className="auth-page admin-page">
      <section className="section">
        {!summary ? (
          <LoadingBall label={copy.common.loading} variant="section" />
        ) : (
          <div className="admin-shell">
            <Reveal className="auth-card admin-hero-card">
              <div className="admin-hero-copy">
                <SectionTitle eyebrow={copy.auth.adminEyebrow} title={copy.auth.adminTitle} copy={copy.auth.adminCopy} />
              </div>

              <div className="admin-hero-metrics">
                <article className="admin-hero-metric">
                  <span>{copy.auth.paidRevenue}</span>
                  <strong>{formatCurrency(summary.paidRevenue || 0)}</strong>
                </article>
                <article className="admin-hero-metric">
                  <span>{copy.auth.totalOrders}</span>
                  <strong>{summary.orders}</strong>
                </article>
              </div>
            </Reveal>

            <div className="admin-stats-grid">
              {statCards.map((card) => (
                <Reveal key={card.key} className="auth-card admin-stat-card">
                  <div className="admin-stat-icon">
                    <Icon name={card.icon} />
                  </div>
                  <span>{card.label}</span>
                  <strong>{card.value}</strong>
                </Reveal>
              ))}
            </div>

            <div className="admin-dashboard-grid">
              <Reveal className="auth-card admin-trend-card">
                <div className="admin-card-header">
                  <div>
                    <span>{copy.auth.weeklyPerformance}</span>
                    <strong>{copy.auth.weeklyPerformanceCopy}</strong>
                  </div>
                </div>

                <div className="admin-trend-chart">
                  {trend.map((item) => (
                    <div key={item.key} className="admin-trend-column">
                      <span className="admin-trend-value">{item.orders}</span>
                      <div className="admin-trend-bar-track">
                        <div
                          className="admin-trend-bar"
                          style={{ height: `${Math.max((item.orders / maxTrendOrders) * 100, item.orders ? 18 : 6)}%` }}
                        />
                      </div>
                      <strong>{item.label}</strong>
                      <small>{formatCurrency(item.revenue || 0)}</small>
                    </div>
                  ))}
                </div>
              </Reveal>

              <Reveal className="auth-card admin-payment-card">
                <div className="admin-card-header">
                  <div>
                    <span>{copy.auth.paymentMixTitle}</span>
                    <strong>{copy.auth.paymentMixCopy}</strong>
                  </div>
                </div>

                <div className="admin-payment-split">
                  <div className="admin-payment-line">
                    <div className="admin-payment-track">
                      <div className="admin-payment-fill card" style={{ width: `${paymentSplit.cardPercent}%` }} />
                    </div>
                    <strong>{paymentSplit.cardPercent}%</strong>
                  </div>

                  <div className="admin-payment-grid">
                    <article className="admin-payment-item">
                      <span>{copy.auth.cardOrders}</span>
                      <strong>{paymentSplit.card}</strong>
                    </article>
                    <article className="admin-payment-item">
                      <span>{copy.auth.cashOrders}</span>
                      <strong>{paymentSplit.cash}</strong>
                    </article>
                  </div>
                </div>

                <div className="admin-status-pills">
                  {Object.entries(summary.statusMix || {}).map(([status, count]) => (
                    <div key={status} className="admin-status-pill">
                      <span>{orderStatusLabel(status)}</span>
                      <strong>{count}</strong>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            <Reveal className="auth-card admin-filters-card">
              <div className="admin-card-header">
                <div>
                  <span>{copy.auth.manageOrders}</span>
                  <strong>{copy.auth.manageOrdersCopy}</strong>
                </div>
                <div className="admin-pagination-caption">
                  {copy.auth.pageLabel} {adminOrdersPagination?.page || 1} / {adminOrdersPagination?.totalPages || 1}
                </div>
              </div>

              <form className="auth-form admin-filter-form" onSubmit={handleApplyFilters}>
                <div className="admin-filter-grid">
                  <label>
                    {copy.auth.filterOrderNumber}
                    <input
                      value={filters.orderNumber}
                      onChange={(event) => handleFilterChange("orderNumber", event.target.value)}
                      placeholder={copy.auth.filterOrderNumberPlaceholder}
                    />
                  </label>
                  <label>
                    {copy.auth.filterPaymentMethod}
                    <select value={filters.paymentMethod} onChange={(event) => handleFilterChange("paymentMethod", event.target.value)}>
                      {paymentMethodOptions.map((option) => (
                        <option key={option.value || "all"} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    {copy.auth.filterPaymentStatus}
                    <select value={filters.paymentStatus} onChange={(event) => handleFilterChange("paymentStatus", event.target.value)}>
                      {paymentStatusOptions.map((option) => (
                        <option key={option.value || "all"} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    {copy.auth.filterOrderStatus}
                    <select value={filters.orderStatus} onChange={(event) => handleFilterChange("orderStatus", event.target.value)}>
                      {orderStatusOptions.map((option) => (
                        <option key={option.value || "all"} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    {copy.auth.filterDateFrom}
                    <input type="date" value={filters.dateFrom} onChange={(event) => handleFilterChange("dateFrom", event.target.value)} />
                  </label>
                  <label>
                    {copy.auth.filterDateTo}
                    <input type="date" value={filters.dateTo} onChange={(event) => handleFilterChange("dateTo", event.target.value)} />
                  </label>
                  <label>
                    {copy.auth.filterSort}
                    <select value={filters.sort} onChange={(event) => handleFilterChange("sort", event.target.value)}>
                      <option value="newest">{copy.auth.sortNewest}</option>
                      <option value="oldest">{copy.auth.sortOldest}</option>
                    </select>
                  </label>
                </div>

                <div className="admin-filter-actions">
                  <button type="button" className="ghost-button" onClick={handleClearFilters}>
                    <Icon name="refresh" />
                    {copy.auth.clearFilters}
                  </button>
                  <button type="submit" className="primary-button">
                    <Icon name="spark" />
                    {copy.auth.applyFilters}
                  </button>
                </div>
              </form>
            </Reveal>

            <Reveal className="auth-card admin-orders-premium-card">
              <div className="admin-card-header">
                <div>
                  <span>{copy.auth.recentOrders}</span>
                  <strong>{copy.auth.recentOrdersCopy}</strong>
                </div>
                <div className="admin-pagination-caption">{adminOrdersPagination?.totalItems || 0}</div>
              </div>

              {adminOrdersStatus === "loading" ? (
                <LoadingBall label={copy.common.loading} variant="section" />
              ) : (
                <>
                  <div className="admin-orders-table">
                    {adminOrders.length ? (
                      adminOrders.map((order) => (
                        <article key={order.orderNumber} className="admin-order-row">
                          <div className="admin-order-primary">
                            <strong>{order.orderNumber}</strong>
                            <span>{order.customer?.name}</span>
                            <small>
                              {copy.auth.orderDate}: {formatAdminDate(order.createdAt, language)}
                            </small>
                          </div>

                          <div className="admin-order-meta">
                            <div>
                              <span>{copy.auth.itemsLabel}</span>
                              <strong>{order.itemCount}</strong>
                            </div>
                            <div>
                              <span>{copy.auth.paymentMethodLabel}</span>
                              <strong>{paymentMethodLabel(order.paymentMethod)}</strong>
                            </div>
                            <div>
                              <span>{copy.auth.paymentStatusLabel}</span>
                              <strong className={`admin-badge payment-${order.paymentStatus}`}>{paymentStatusLabel(order.paymentStatus)}</strong>
                            </div>
                            <div>
                              <span>{copy.auth.orderStatusLabel}</span>
                              <strong className={`admin-badge status-${order.orderStatus}`}>{orderStatusLabel(order.orderStatus)}</strong>
                            </div>
                          </div>

                          <div className="admin-order-side">
                            <button
                              type="button"
                              className="ghost-button icon-badge-button admin-order-menu-button"
                              aria-label={`${copy.auth.editStatuses} ${order.orderNumber}`}
                              onClick={() => handleOpenStatusModal(order.orderNumber)}
                            >
                              <Icon name="more-horizontal" />
                            </button>

                            <div className="admin-order-total">
                              <span>{copy.cart.total}</span>
                              <strong>{formatCurrency(order.totalTnd || 0)}</strong>
                            </div>
                          </div>
                        </article>
                      ))
                    ) : (
                      <p className="admin-empty-note">{copy.auth.noOrdersMatch}</p>
                    )}
                  </div>

                  <div className="admin-pagination">
                    <button
                      type="button"
                      className="ghost-button"
                      disabled={!adminOrdersPagination?.hasPreviousPage}
                      onClick={() => setPage((current) => Math.max(1, current - 1))}
                    >
                      <Icon name="arrow-left" />
                      {copy.auth.previousPage}
                    </button>
                    <span className="admin-pagination-caption">
                      {copy.auth.pageLabel} {adminOrdersPagination?.page || 1} / {adminOrdersPagination?.totalPages || 1}
                    </span>
                    <button
                      type="button"
                      className="ghost-button"
                      disabled={!adminOrdersPagination?.hasNextPage}
                      onClick={() => setPage((current) => current + 1)}
                    >
                      {copy.auth.nextPage}
                      <Icon name="arrow-right" />
                    </button>
                  </div>
                </>
              )}
            </Reveal>
          </div>
        )}
      </section>

      {statusModalOrder ? (
        <div className="auth-modal-backdrop" role="presentation" onClick={handleCloseStatusModal}>
          <div className="auth-modal admin-status-modal" role="dialog" aria-modal="true" aria-labelledby="admin-status-title" onClick={(event) => event.stopPropagation()}>
            <div className="auth-modal-header">
              <div>
                <span>{copy.auth.statusModalEyebrow}</span>
                <strong id="admin-status-title">{copy.auth.statusModalTitle}</strong>
              </div>
              <button type="button" className="auth-modal-close" aria-label={copy.auth.cancelAction} onClick={handleCloseStatusModal}>
                <Icon name="close" />
              </button>
            </div>

            <p className="auth-modal-copy">{copy.auth.statusModalCopy}</p>

            <div className="admin-status-modal-summary">
              <article className="admin-status-modal-card">
                <span>{copy.auth.filterOrderNumber}</span>
                <strong>{statusModalOrder.orderNumber}</strong>
                <small>
                  {copy.auth.orderDate}: {formatAdminDate(statusModalOrder.createdAt, language)}
                </small>
              </article>

              <article className="admin-status-modal-card">
                <span>{copy.checkout.customerTitle}</span>
                <strong>{statusModalOrder.customer?.name}</strong>
                <small>{statusModalOrder.customer?.email}</small>
              </article>

              <article className="admin-status-modal-card">
                <span>{copy.cart.total}</span>
                <strong>{formatCurrency(statusModalOrder.totalTnd || 0)}</strong>
                <small>
                  {statusModalOrder.itemCount} {copy.auth.itemsLabel.toLowerCase()}
                </small>
              </article>
            </div>

            <div className="admin-status-modal-badges">
              <strong className={`admin-badge payment-${statusModalOrder.paymentStatus}`}>{paymentStatusLabel(statusModalOrder.paymentStatus)}</strong>
              <strong className={`admin-badge status-${statusModalOrder.orderStatus}`}>{orderStatusLabel(statusModalOrder.orderStatus)}</strong>
            </div>

            <form
              className="auth-form admin-status-modal-form"
              onSubmit={(event) => {
                event.preventDefault();
                handleSaveStatuses(statusModalOrder);
              }}
            >
              <div className="admin-status-modal-grid">
                <label className="admin-order-select">
                  <span>{copy.auth.paymentStatusLabel}</span>
                  <select
                    value={statusDrafts[statusModalOrder.orderNumber]?.paymentStatus || statusModalOrder.paymentStatus}
                    onChange={(event) => handleDraftChange(statusModalOrder.orderNumber, "paymentStatus", event.target.value)}
                  >
                    {paymentStatusOptions
                      .filter((option) => option.value)
                      .map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                  </select>
                </label>

                <label className="admin-order-select">
                  <span>{copy.auth.orderStatusLabel}</span>
                  <select
                    value={statusDrafts[statusModalOrder.orderNumber]?.orderStatus || statusModalOrder.orderStatus}
                    onChange={(event) => handleDraftChange(statusModalOrder.orderNumber, "orderStatus", event.target.value)}
                  >
                    {orderStatusOptions
                      .filter((option) => option.value)
                      .map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                  </select>
                </label>
              </div>

              <div className="admin-status-modal-actions">
                <button type="button" className="ghost-button" onClick={handleCloseStatusModal}>
                  <Icon name="close" />
                  {copy.auth.cancelAction}
                </button>
                <button
                  type="submit"
                  className="primary-button admin-save-button"
                  disabled={actionStatus === "loading" && updatingOrderNumber === statusModalOrder.orderNumber}
                >
                  <Icon name="check-circle" />
                  {copy.auth.saveStatuses}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default AdminPage;
