export const formatCurrency = (amount) =>
  new Intl.NumberFormat("fr-TN", {
    style: "currency",
    currency: "TND",
    maximumFractionDigits: 0
  }).format(amount);

