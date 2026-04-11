export const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "TND",
    maximumFractionDigits: 0
  }).format(amount);
