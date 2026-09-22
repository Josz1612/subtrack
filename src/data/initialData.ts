import { Subscription, PaymentHistoryItem, UserProfile } from '../types';
import { SUBTRACK_LOGO_SVG_DATA_URL } from '../components/SubTrackLogo';

export const SUBTRACK_LOGO_URL = SUBTRACK_LOGO_SVG_DATA_URL;

export const ALEX_AVATAR_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCRnNvF3bwRLkpcTvRNB2Pp-kP_6TBVndIGfZnCLo7jvqKNi2bt5tXfmiDDIcga3QGGUm7l1al6LSksVDNG9jyHvjq5ymoeV4lXB1FH0nrBAX5FIaW7_xn0iFpHqc-kH2RoOHq1HLpGk6JFotWfvjm4HASnWYn6JusJpfO2U3ijF7EPzbGWyFpoGDzafMpSpbPZ32MogpyJQln2tA9_h4YF1CdnL1EIAbaEwx3VO2XGkayyjnA-gkz4bA';

export const WORK_AVATAR_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDSl6jigw_ntXhdIyK2HTx7K_nymASQO1grAuMW3Hfv-jaBjlxxUXdwYQYo87-WnILmCtXpIU_mbhCVWUe64i4Ze7ZLFuFjjszLKlWDelTN9dMxEpzgQdq8U8cZC7QpBSTzsUftTTeYwgapLJz69hqjxVwWhMlreoSYPnNsvQD3TFs0cvRpr38SzOzU2NNP1fKbBozqSuHVb3lX82t2ZSposo03E_L-FpatGgAFTtgw06ezvZC4M8HAGQ';

export const GOOGLE_ICON_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCrNgypV1vmwwQvvzovV9c0EtkqNUJieOUTpVFs7hC4spbqaHfLMtNKY8cVyHMo_W_FOycomqi717Z0VMUxmMYDV448nae80uOai9SLpegNAprkAWgiR8ScV0WzD4Ak3y3AeIzVYXSJ7AbVBpCIoMclHWSb8pOPGU5f8Df3oXc_SsDJcs0S9uTVVTjaf-EDUj-jEjP9BnM5_6MFdLGTghqal-_VeZY5WubT3czl6t5IeAD51fO89nSgng';

export const APPLE_ICON_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBA1g2LOPas6DnO_nUqg_maiqeI5tU-EdAjwJjeUxSe1NfpP-OtrvmG66oh4qV2WrcAVekd_LqrCQ_K3WU6Vl_kZ-yT4iFCmUA20uwwgJml_jBvr9zWIqMPGDZJ8s5QzyMKNVtcdUCW3vxcdiWY7UZvLh6GeJVHQ2N3PGxGmL_k_srwCcDR2oEhgIr9Xm9KJbgnquetH6XeRrKRCIQNf6GZxGOyRKOt9euWCa8bg_c9dUilfxI9NEuycQ';

export const getCurrentMonthDate = (day: number): string => {
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth();

  if (day < now.getDate()) {
    month += 1;
    if (month > 11) {
      month = 0;
      year += 1;
    }
  }

  const monthStr = String(month + 1).padStart(2, '0');
  const dayStr = String(day).padStart(2, '0');
  return `${year}-${monthStr}-${dayStr}`;
};

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Alex Smith',
  email: 'alex.smith@gmail.com',
  avatarUrl: ALEX_AVATAR_URL,
  preferredCurrency: 'MXN',
  monthlyBudgetGoal: 3000.0,
  budgetGoalEnabled: true,
  notification1Day: true,
  notification3Days: false,
  monthlyReport: true,
  biometricLogin: false,
};

export const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub-netflix',
    name: 'Netflix',
    category: 'Entertainment',
    amount: 269,
    currency: 'MXN',
    billingCycle: 'monthly',
    nextPaymentDate: getCurrentMonthDate(15),
    paymentMethod: {
      type: 'VISA',
      last4: '4242',
    },
    planName: 'Monthly Plan',
    reminderDays: 3,
    status: 'active',
    logoType: 'netflix',
    iconLetter: 'N',
    iconBgColor: '#000000',
  },
  {
    id: 'sub-spotify',
    name: 'Spotify',
    category: 'Entertainment',
    amount: 139,
    currency: 'MXN',
    billingCycle: 'monthly',
    nextPaymentDate: getCurrentMonthDate(20),
    paymentMethod: {
      type: 'MASTERCARD',
      last4: '8899',
    },
    planName: 'Individual Premium',
    reminderDays: 1,
    status: 'active',
    logoType: 'spotify',
    iconLetter: 'S',
    iconBgColor: '#1DB954',
  },
  {
    id: 'sub-adobe',
    name: 'Adobe Creative Cloud',
    category: 'Productivity',
    amount: 699,
    currency: 'MXN',
    billingCycle: 'monthly',
    nextPaymentDate: getCurrentMonthDate(25),
    paymentMethod: {
      type: 'MASTERCARD',
      last4: '8899',
    },
    planName: 'All Apps Plan',
    reminderDays: 3,
    status: 'active',
    logoType: 'adobe',
    iconLetter: 'A',
    iconBgColor: '#2b2624',
  },
  {
    id: 'sub-icloud',
    name: 'iCloud',
    category: 'Utilities',
    amount: 49,
    currency: 'MXN',
    billingCycle: 'monthly',
    nextPaymentDate: getCurrentMonthDate(20),
    paymentMethod: {
      type: 'VISA',
      last4: '1234',
    },
    planName: '50 GB Storage',
    reminderDays: 1,
    status: 'active',
    logoType: 'icloud',
    iconLetter: 'i',
    iconBgColor: '#e0f2fe',
  },
  {
    id: 'sub-gym',
    name: 'Gym Membership',
    category: 'Health',
    amount: 499,
    currency: 'MXN',
    billingCycle: 'monthly',
    nextPaymentDate: getCurrentMonthDate(1),
    paymentMethod: {
      type: 'VISA',
      last4: '4242',
    },
    planName: 'Standard Access',
    reminderDays: 2,
    status: 'active',
    logoType: 'gym',
    iconLetter: 'G',
    iconBgColor: '#34302c',
  },
  {
    id: 'sub-prime',
    name: 'Amazon Prime',
    category: 'Entertainment',
    amount: 99,
    currency: 'MXN',
    billingCycle: 'monthly',
    nextPaymentDate: getCurrentMonthDate(28),
    paymentMethod: {
      type: 'VISA',
      last4: '4242',
    },
    planName: 'Prime Monthly',
    reminderDays: 2,
    status: 'active',
    logoType: 'amazon',
    iconLetter: 'a',
    iconBgColor: '#00A8E1',
  },
];

export const INITIAL_PAYMENT_HISTORY: PaymentHistoryItem[] = [
  {
    id: 'hist-1',
    subscriptionId: 'sub-gym',
    name: 'Gym Membership',
    date: 'Nov 1',
    fullDate: '2026-11-01',
    amount: 499,
    currency: 'MXN',
    status: 'Paid',
    iconType: 'gym',
    category: 'Health',
  },
  {
    id: 'hist-2',
    subscriptionId: 'sub-prime',
    name: 'Amazon Prime',
    date: 'Oct 28',
    fullDate: '2026-10-28',
    amount: 99,
    currency: 'MXN',
    status: 'Paid',
    iconType: 'amazon',
    category: 'Entertainment',
  },
  {
    id: 'hist-3',
    subscriptionId: 'sub-adobe',
    name: 'Adobe Creative Cloud',
    date: 'Oct 25',
    fullDate: '2026-10-25',
    amount: 699,
    currency: 'MXN',
    status: 'Paid',
    iconType: 'adobe',
    category: 'Productivity',
  },
  {
    id: 'hist-4',
    subscriptionId: 'sub-spotify',
    name: 'Spotify',
    date: 'Oct 20',
    fullDate: '2026-10-20',
    amount: 139,
    currency: 'MXN',
    status: 'Paid',
    iconType: 'spotify',
    category: 'Entertainment',
  },
  {
    id: 'hist-5',
    subscriptionId: 'sub-netflix',
    name: 'Netflix',
    date: 'Oct 15',
    fullDate: '2026-10-15',
    amount: 269,
    currency: 'MXN',
    status: 'Paid',
    iconType: 'netflix',
    category: 'Entertainment',
  },
];

export const POPULAR_PRESETS = [
  {
    name: 'Netflix',
    category: 'Entertainment' as const,
    amount: 269,
    currency: 'MXN' as const,
    billingCycle: 'monthly' as const,
    iconLetter: 'N',
    iconBgColor: '#e50914',
    logoType: 'netflix' as const,
    defaultPlan: 'Standard (1080p)',
  },
  {
    name: 'Spotify',
    category: 'Entertainment' as const,
    amount: 139,
    currency: 'MXN' as const,
    billingCycle: 'monthly' as const,
    iconLetter: 'S',
    iconBgColor: '#1DB954',
    logoType: 'spotify' as const,
    defaultPlan: 'Individual Premium',
  },
  {
    name: 'Prime Video',
    category: 'Entertainment' as const,
    amount: 99,
    currency: 'MXN' as const,
    billingCycle: 'monthly' as const,
    iconLetter: 'P',
    iconBgColor: '#00A8E1',
    logoType: 'amazon' as const,
    defaultPlan: 'Prime Monthly',
  },
  {
    name: 'Gym Club',
    category: 'Health' as const,
    amount: 499,
    currency: 'MXN' as const,
    billingCycle: 'monthly' as const,
    iconLetter: 'G',
    iconBgColor: '#2b2826',
    logoType: 'gym' as const,
    defaultPlan: 'Full Membership',
  },
  {
    name: 'Adobe CC',
    category: 'Productivity' as const,
    amount: 699,
    currency: 'MXN' as const,
    billingCycle: 'monthly' as const,
    iconLetter: 'A',
    iconBgColor: '#34302c',
    logoType: 'adobe' as const,
    defaultPlan: 'All Apps Plan',
  },
  {
    name: 'iCloud+',
    category: 'Utilities' as const,
    amount: 49,
    currency: 'MXN' as const,
    billingCycle: 'monthly' as const,
    iconLetter: 'i',
    iconBgColor: '#007AFF',
    logoType: 'icloud' as const,
    defaultPlan: '50 GB Storage',
  },
  {
    name: 'ChatGPT Plus',
    category: 'Productivity' as const,
    amount: 400.0,
    currency: 'MXN' as const,
    billingCycle: 'monthly' as const,
    iconLetter: 'C',
    iconBgColor: '#10a37f',
    logoType: 'chatgpt' as const,
    defaultPlan: 'Plus Plan',
  },
  {
    name: 'YouTube Premium',
    category: 'Entertainment' as const,
    amount: 100,
    currency: 'MXN' as const,
    billingCycle: 'monthly' as const,
    iconLetter: 'Y',
    iconBgColor: '#ff0000',
    logoType: 'custom' as const,
    defaultPlan: 'Individual',
  },
];

export function formatCurrency(amount: number, targetCurrency: string = 'MXN'): string {
  const symbolMap: Record<string, string> = {
    USD: '$',
    EUR: '€',
    MXN: '$',
    GBP: '£',
  };
  const symbol = symbolMap[targetCurrency] || '$';

  // Base price in DB is assumed MXN
  let convertedAmount = amount;
  if (targetCurrency === 'USD') {
    convertedAmount = amount / 18.5;
  } else if (targetCurrency === 'EUR') {
    convertedAmount = amount / 20.5;
  } else if (targetCurrency === 'GBP') {
    convertedAmount = amount / 24.0;
  }

  return `${symbol}${convertedAmount.toFixed(2)}`;
}
