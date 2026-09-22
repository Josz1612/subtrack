export const EXCHANGE_RATES: Record<string, number> = {
  USD: 1.0,
  MXN: 20.00,
  EUR: 0.93,
  GBP: 0.78
};

export function convertCurrency(amount: number, fromCurrency: string, toCurrency: string): number {
  if (fromCurrency === toCurrency) return amount;
  const fromRate = EXCHANGE_RATES[fromCurrency] || 1.0;
  const toRate = EXCHANGE_RATES[toCurrency] || 1.0;
  return (amount / fromRate) * toRate;
}
