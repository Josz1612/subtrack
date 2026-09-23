import { useMemo } from 'react';
import { Subscription, PaymentHistoryItem, Currency } from '../types';
import { convertCurrency } from '../utils/currencyUtils';
import { formatCurrency } from '../data/initialData';

export function useAIPredictor(
  subscriptions: Subscription[],
  history: PaymentHistoryItem[],
  currency: Currency
) {
  return useMemo(() => {
    const activeSubs = subscriptions.filter(s => s.status === 'active');
    
    // Si no hay suscripciones, no hay nada que predecir
    if (activeSubs.length === 0 && history.length === 0) {
      return {
        predictionAmount: 0,
        text: 'La IA necesita más datos de suscripciones para generar una predicción.',
        isReady: false
      };
    }

    // Calcular el gasto de los últimos 6 meses (incluyendo el actual)
    const now = new Date();
    const monthlySpending: number[] = [];
    
    // Mes 0 es hace 5 meses, Mes 5 es el actual
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = d.getMonth();
      const year = d.getFullYear();

      let amount = 0;
      if (i === 0) {
        amount = activeSubs.reduce((sum, s) => sum + convertCurrency(s.amount, s.currency, currency), 0);
      } else {
        const monthHistory = history.filter(h => {
          const [hYear, hMonth] = h.fullDate.split('-');
          return parseInt(hYear, 10) === year && parseInt(hMonth, 10) - 1 === month;
        });
        amount = monthHistory.reduce((sum, h) => sum + convertCurrency(h.amount, h.currency, currency), 0);
      }
      monthlySpending.push(amount);
    }

    // Regresión lineal simple: y = mx + b
    // x = [0, 1, 2, 3, 4, 5]
    // y = monthlySpending
    const n = monthlySpending.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    
    for (let i = 0; i < n; i++) {
      sumX += i;
      sumY += monthlySpending[i];
      sumXY += i * monthlySpending[i];
      sumX2 += i * i;
    }
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    // Predicción para el próximo mes (x = 6)
    let prediction = slope * 6 + intercept;
    
    // La predicción no puede ser negativa en este contexto
    if (prediction < 0) prediction = 0;
    
    // Encontrar categoría más frecuente / de mayor gasto
    const categoryTotals: Record<string, number> = {};
    activeSubs.forEach(s => {
      const amt = convertCurrency(s.amount, s.currency, currency);
      categoryTotals[s.category] = (categoryTotals[s.category] || 0) + amt;
    });
    
    let topCategory = '';
    let maxCatAmount = -1;
    for (const [cat, amt] of Object.entries(categoryTotals)) {
      if (amt > maxCatAmount) {
        maxCatAmount = amt;
        topCategory = cat;
      }
    }

    const catTranslations: Record<string, string> = {
      'Entertainment': 'Entretenimiento',
      'Productivity': 'Productividad',
      'Utilities': 'Servicios (Utilities)',
      'Health': 'Salud',
      'Developer': 'Desarrollo'
    };
    
    const translatedCat = catTranslations[topCategory] || topCategory;
    const formattedPrediction = formatCurrency(prediction, currency);

    let trendText = slope > 5 ? 'aumento constante' : slope < -5 ? 'tendencia a la baja' : 'comportamiento estable';

    const text = `Según tu ${trendText}, la IA predice que gastarás aproximadamente ${formattedPrediction} el próximo mes. Tienes una alta concentración en la categoría de ${translatedCat}.`;

    return {
      predictionAmount: prediction,
      text,
      isReady: true,
      topCategory: translatedCat
    };
  }, [subscriptions, history, currency]);
}
