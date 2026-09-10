export type Currency = 'USD' | 'EUR' | 'MXN' | 'GBP';

export type BillingCycle = 'monthly' | 'yearly' | 'weekly';

export type Category = 'Entertainment' | 'Productivity' | 'Utilities' | 'Health' | 'Developer' | 'Other';

export interface Subscription {
  id: string;
  name: string;
  category: Category;
  amount: number;
  currency: Currency;
  billingCycle: BillingCycle;
  nextPaymentDate: string; // YYYY-MM-DD
  paymentMethod: {
    type: 'VISA' | 'MASTERCARD' | 'APPLE_PAY' | 'PAYPAL' | 'OTHER';
    last4: string;
  };
  planName?: string;
  reminderDays: number;
  status: 'active' | 'paused' | 'cancelled';
  logoType?: 'netflix' | 'spotify' | 'adobe' | 'icloud' | 'amazon' | 'gym' | 'chatgpt' | 'custom';
  iconLetter?: string;
  iconBgColor?: string;
  notes?: string;
}

export interface PaymentHistoryItem {
  id: string;
  subscriptionId?: string;
  name: string;
  date: string; // e.g. "Nov 1", "Oct 28"
  fullDate: string; // YYYY-MM-DD
  amount: number;
  currency: Currency;
  status: 'Paid' | 'Pending' | 'Failed';
  iconType: 'gym' | 'amazon' | 'netflix' | 'spotify' | 'adobe' | 'icloud' | 'general';
  category: Category;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  preferredCurrency: Currency;
  monthlyBudgetGoal: number;
  budgetGoalEnabled: boolean;
  notification1Day: boolean;
  notification3Days: boolean;
  monthlyReport: boolean;
  biometricLogin: boolean;
}

export type ScreenId =
  | 'register'
  | 'google_select'
  | 'google_consent'
  | 'onboarding'
  | 'overview'
  | 'payments'
  | 'insights'
  | 'settings'
  | 'detail'
  | 'new_subscription';
