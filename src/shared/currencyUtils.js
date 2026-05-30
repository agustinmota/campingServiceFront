export function formatCurrency(value) {
  const amount = Number(value || 0);
  return `USD ${amount.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
}
