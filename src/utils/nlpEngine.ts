import { Subscription, Currency } from '../types';
import { getCurrentMonthDate } from '../data/initialData';

interface NLPResult {
  success: boolean;
  message: string;
  subscriptionData?: Omit<Subscription, 'id'>;
}

export const processNLPChat = (text: string, globalCurrency: Currency): NLPResult => {
  const lowerText = text.toLowerCase();

  // Regex para montos (acepta comas o puntos, ej. 129, 15.99)
  const amountMatch = lowerText.match(/\d+(?:[.,]\d{1,2})?/);
  
  // Si no hay monto, fracasa.
  if (!amountMatch) {
    return {
      success: false,
      message: "No logré entender todos los datos. Intenta decir algo como: 'Agrega Amazon Prime por 99 pesos mensuales'.",
    };
  }
  
  const amount = parseFloat(amountMatch[0].replace(',', '.'));

  // Detectar divisas
  let currency: Currency = globalCurrency;
  if (/(pesos|mxn)/.test(lowerText)) currency = 'MXN';
  else if (/(dolares|dólares|usd|bucks)/.test(lowerText)) currency = 'USD';
  else if (/(euros|eur)/.test(lowerText)) currency = 'EUR';
  else if (/(libras|gbp)/.test(lowerText)) currency = 'GBP';

  // Extraer nombre del servicio
  // Buscamos palabras clave conocidas primero, si no, intentamos extraer texto después de "agrega", "añade", etc.
  const commonServices = ['netflix', 'spotify', 'amazon', 'prime', 'youtube', 'gym', 'gimnasio', 'hbo', 'disney', 'chatgpt', 'icloud', 'apple', 'adobe', 'canva'];
  let name = '';
  
  for (const service of commonServices) {
    if (lowerText.includes(service)) {
      name = service.charAt(0).toUpperCase() + service.slice(1);
      break;
    }
  }

  // Fallback para nombres desconocidos
  if (!name) {
    const actionMatch = lowerText.match(/(?:agrega|añade|pagué|registra)\s+([a-z0-9\s]+?)\s*(?:por|de|a|el|la)\s*\d+/);
    if (actionMatch && actionMatch[1]) {
      name = actionMatch[1].trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    } else {
      name = 'Suscripción Desconocida';
    }
  }
  
  // Limpiar nombre extraído de conectores
  name = name.replace(/^(el|la|los|las|un|una)\s+/i, '');

  const nextPayment = new Date();
  nextPayment.setMonth(nextPayment.getMonth() + 1);
  // Formatear a YYYY-MM-DD
  const yyyy = nextPayment.getFullYear();
  const mm = String(nextPayment.getMonth() + 1).padStart(2, '0');
  const dd = String(nextPayment.getDate()).padStart(2, '0');
  const formattedNextPaymentDate = `${yyyy}-${mm}-${dd}`;

  let iconBg = '#34302c';
  let iconLtr = name.charAt(0).toUpperCase();
  let logoType: Subscription['logoType'] = 'custom';

  const lowerName = name.toLowerCase();
  if (lowerName.includes('netflix')) {
    iconBg = '#000000';
    iconLtr = 'N';
    logoType = 'netflix';
  } else if (lowerName.includes('spotify')) {
    iconBg = '#1DB954';
    iconLtr = 'S';
    logoType = 'spotify';
  } else if (lowerName.includes('icloud')) {
    iconBg = '#007AFF';
    iconLtr = 'i';
    logoType = 'icloud';
  } else if (lowerName.includes('adobe')) {
    iconBg = '#2b2624';
    iconLtr = 'A';
    logoType = 'adobe';
  } else if (lowerName.includes('gym')) {
    iconBg = '#34302c';
    iconLtr = 'G';
    logoType = 'gym';
  } else if (lowerName.includes('amazon') || lowerName.includes('prime')) {
    iconBg = '#00A8E1';
    iconLtr = 'a';
    logoType = 'amazon';
  }

  const newSubscription: Omit<Subscription, 'id'> = {
    name,
    amount,
    currency,
    category: 'Entertainment', // Categoría por defecto
    billingCycle: 'monthly',
    nextPaymentDate: formattedNextPaymentDate,
    status: 'active',
    logoType,
    iconLetter: iconLtr,
    iconBgColor: iconBg,
    reminderDays: 1,
    paymentMethod: {
      type: 'VISA',
      last4: '****'
    }
  };

  return {
    success: true,
    message: `¡Hecho! He registrado ${name} por ${amount} ${currency}. El próximo cobro será dentro de un mes.`,
    subscriptionData: newSubscription,
  };
};
