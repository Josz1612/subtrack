export const EXCHANGE_RATES: Record<string, number> = {
  USD: 1.0,
  MXN: 20.00,
  EUR: 0.93,
  GBP: 0.78
};

export const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string): number => {
  if (fromCurrency === toCurrency) return amount;
  // Convertir primero a USD (moneda pivote) y luego a la moneda destino
  const amountInUSD = amount / EXCHANGE_RATES[fromCurrency];
  return amountInUSD * EXCHANGE_RATES[toCurrency];
};
