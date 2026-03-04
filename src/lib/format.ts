const formatCurrency = new Intl.NumberFormat("en-LK", {
  style: "currency",
  currency: "LKR",
  minimumFractionDigits: 2,
});

const normalizeAmount = (value?: number | string | null) => {
  if (value === null || value === undefined) return 0;
  const num = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(num)) return 0;
  return num;
};

export function formatPrice(amount?: number | string | null) {
  const value = normalizeAmount(amount);
  return formatCurrency.format(value);
}
