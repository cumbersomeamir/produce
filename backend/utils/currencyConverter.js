const fallbackRates = {
  INR: 1,
  USD: 0.012,
  EUR: 0.011,
};

export function convertCurrency(amount, from = "INR", to = "USD") {
  const inInr = Number(amount) / (fallbackRates[from] || 1);
  return Number((inInr * (fallbackRates[to] || 1)).toFixed(2));
}
