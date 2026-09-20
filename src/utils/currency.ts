import { Currency } from '../types';

// Tasas de cambio de referencia respecto al MXN (peso mexicano como base)
export const EXCHANGE_RATES: Record<Currency, number> = {
  MXN: 1.0,
  USD: 1 / 18.5, // 1 USD = 18.5 MXN
  EUR: 1 / 20.5, // 1 EUR = 20.5 MXN
  GBP: 1 / 24.0, // 1 GBP = 24.0 MXN
};

/**
 * Convierte un monto de una moneda a otra.
 * @param amount Monto original
 * @param fromCurrency Moneda original
 * @param toCurrency Moneda destino
 * @returns Monto recalculado y redondeado a 2 decimales
 */
export const convertAmount = (amount: number, fromCurrency: Currency, toCurrency: Currency): number => {
  if (fromCurrency === toCurrency) return amount;

  // Convertir a USD primero como base, luego a la moneda destino
  const amountInUSD = amount / EXCHANGE_RATES[fromCurrency];
  const convertedAmount = amountInUSD * EXCHANGE_RATES[toCurrency];

  // Redondear a 2 decimales
  return Math.round(convertedAmount * 100) / 100;
};
