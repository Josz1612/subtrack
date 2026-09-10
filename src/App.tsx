import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { ScreenId, Subscription, PaymentHistoryItem, UserProfile, Currency } from './types';
import {
  INITIAL_USER_PROFILE,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_PAYMENT_HISTORY,
} from './data/initialData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { RegisterScreen } from './components/RegisterScreen';
import { GoogleAccountSelectScreen } from './components/GoogleAccountSelectScreen';
import { GoogleConsentScreen } from './components/GoogleConsentScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { PaymentsScreen } from './components/PaymentsScreen';
import { OverviewScreen } from './components/OverviewScreen';
import { InsightsScreen } from './components/InsightsScreen';
import { SubscriptionDetailScreen } from './components/SubscriptionDetailScreen';
import { NewSubscriptionModal } from './components/NewSubscriptionModal';
import { SettingsScreen } from './components/SettingsScreen';
import { CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentScreen = location.pathname.substring(1) || 'payments';

  const [selectedSub, setSelectedSub] = useState<Subscription | null>(INITIAL_SUBSCRIPTIONS[0]);
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);
  const [tempGoogleEmail, setTempGoogleEmail] = useState<string>('alex.smith@gmail.com');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Load / Persist State
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('subtrack_user');
      return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
    } catch {
      return INITIAL_USER_PROFILE;
    }
  });

  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    try {
      const saved = localStorage.getItem('subtrack_subscriptions');
      return saved ? JSON.parse(saved) : INITIAL_SUBSCRIPTIONS;
    } catch (error) {
      console.error('Error reading subscriptions from localStorage:', error);
      return INITIAL_SUBSCRIPTIONS;
    }
  });

  const [history, setHistory] = useState<PaymentHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('subtrack_history');
      return saved ? JSON.parse(saved) : INITIAL_PAYMENT_HISTORY;
    } catch {
      return INITIAL_PAYMENT_HISTORY;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('subtrack_user', JSON.stringify(user));
    } catch (e) {}
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('subtrack_subscriptions', JSON.stringify(subscriptions));
    } catch (error) {
      console.error('Error saving subscriptions to localStorage:', error);
    }
  }, [subscriptions]);

  useEffect(() => {
    try {
      localStorage.setItem('subtrack_history', JSON.stringify(history));
    } catch (e) {}
  }, [history]);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    if (type === 'success') toast.success(text);
    else if (type === 'error') toast.error(text);
    else toast(text);
  };

  const handleNavigate = (screen: ScreenId | string) => {
    navigate(`/${screen}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSubscription = (sub: Subscription) => {
    setSelectedSub(sub);
    handleNavigate('detail');
  };

  const handleSaveSubscription = (subData: Omit<Subscription, 'id'>, id?: string) => {
    if (id) {
      // Edit existing
      setSubscriptions((prev) =>
        prev.map((item) => (item.id === id ? { ...subData, id } : item))
      );
      if (selectedSub && selectedSub.id === id) {
        setSelectedSub({ ...subData, id });
      }
      showToast(`¡Suscripción "${subData.name}" actualizada con éxito!`);
    } else {
      // Create new
      const newSub: Subscription = {
        ...subData,
        id: `sub-${Date.now()}`,
      };
      setSubscriptions((prev) => [newSub, ...prev]);
      showToast(`¡Suscripción "${subData.name}" agregada!`);
    }
    setEditingSub(null);
    handleNavigate('payments');
  };

  const handleCancelSubscription = (subId: string) => {
    const target = subscriptions.find((s) => s.id === subId);
    setSubscriptions((prev) => prev.filter((s) => s.id !== subId));
    showToast(`Suscripción "${target?.name || ''}" cancelada y eliminada`, 'info');
    handleNavigate('payments');
  };

  const handleTogglePauseSubscription = (subId: string) => {
    setSubscriptions((prev) =>
      prev.map((s) => {
        if (s.id === subId) {
          const newStatus = s.status === 'active' ? 'paused' : 'active';
          if (selectedSub && selectedSub.id === subId) {
            setSelectedSub({ ...s, status: newStatus });
          }
          showToast(`Suscripción ${newStatus === 'paused' ? 'pausada' : 'reactivada'}`);
          return { ...s, status: newStatus };
        }
        return s;
      })
    );
  };

  const handleRecordPayment = (sub: Subscription) => {
    const newHistItem: PaymentHistoryItem = {
      id: `hist-${Date.now()}`,
      subscriptionId: sub.id,
      name: sub.name,
      date: 'Hoy',
      fullDate: new Date().toISOString().slice(0, 10),
      amount: sub.amount,
      currency: sub.currency,
      status: 'Paid',
      iconType: (sub.logoType as any) || 'general',
      category: sub.category,
    };

    // Advance next payment date by 1 month
    const nextDate = new Date();
    nextDate.setMonth(nextDate.getMonth() + (sub.billingCycle === 'yearly' ? 12 : 1));
    const nextDateStr = nextDate.toISOString().slice(0, 10);

    setHistory((prev) => [newHistItem, ...prev]);
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === sub.id ? { ...s, nextPaymentDate: nextDateStr } : s))
    );
    if (selectedSub && selectedSub.id === sub.id) {
      setSelectedSub((prev) => (prev ? { ...prev, nextPaymentDate: nextDateStr } : null));
    }

    showToast(`¡Pago de ${sub.name} registrado con éxito!`);
  };

  const handleEditSubscription = (sub: Subscription) => {
    setEditingSub(sub);
    handleNavigate('new_subscription');
  };

  const handleAddNew = () => {
    setEditingSub(null);
    handleNavigate('new_subscription');
  };

  // Auth Flow Handlers
  const handleRegisterSubmit = (name: string, email: string) => {
    setUser((prev) => ({ ...prev, name, email }));
    showToast(`¡Bienvenido ${name}!`);
    handleNavigate('onboarding');
  };

  const handleGoogleSignIn = () => {
    handleNavigate('google_select');
  };

  const handleSelectGoogleAccount = (account: {
    name: string;
    email: string;
    avatarUrl: string;
  }) => {
    setTempGoogleEmail(account.email);
    setUser((prev) => ({
      ...prev,
      name: account.name,
      email: account.email,
      avatarUrl: account.avatarUrl,
    }));
    handleNavigate('google_consent');
  };

  const handleAllowGoogleConsent = () => {
    showToast('Cuenta de Google vinculada con éxito');
    handleNavigate('onboarding');
  };

  const handleFinishOnboarding = (data: {
    name: string;
    preferredCurrency: Currency;
    monthlyBudgetGoal: number;
  }) => {
    setUser((prev) => ({
      ...prev,
      name: data.name,
      preferredCurrency: data.preferredCurrency,
      monthlyBudgetGoal: data.monthlyBudgetGoal,
    }));
    showToast('¡Configuración completada!');
    handleNavigate('payments');
  };

  const handleLogout = () => {
    showToast('Sesión cerrada correctamente', 'info');
    handleNavigate('register');
  };

  return (
    <div className="w-full min-h-screen bg-[#090d16] text-[#f1f5f9] selection:bg-[#3b82f6] selection:text-white antialiased font-sans flex flex-col relative overflow-x-hidden">
      <Toaster 
        theme="dark" 
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#0f172a',
            border: '1px solid #1e293b',
            color: '#f1f5f9',
          },
          className: 'shadow-subtrack-lg',
        }}
      />

      {/* Top Application Header */}
      <Header
        user={user}
        onAddNew={handleAddNew}
        onShowToast={showToast}
      />

      {/* Main Screen Views with Responsive Container */}
      <div className="flex-1 w-full max-w-[768px] lg:max-w-[1024px] mx-auto relative pb-24">
        {currentScreen !== 'overview' && (
          <div className="absolute top-4 left-4 sm:left-6 z-[100]">
            <button
              onClick={() => handleNavigate('overview')}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1e293b] hover:bg-[#334155] border border-[#334155] text-[#f1f5f9] shadow-lg transition-all active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-xs font-bold">Volver</span>
            </button>
          </div>
        )}

        <Routes>
          <Route path="/" element={<Navigate to="/payments" replace />} />
          
          <Route path="/register" element={
            <RegisterScreen
              onRegisterSubmit={handleRegisterSubmit}
              onGoogleSignIn={handleGoogleSignIn}
              onAppleSignIn={() => handleNavigate('onboarding')}
              onGoToSignIn={() => handleNavigate('google_select')}
            />
          } />

          <Route path="/google_select" element={
            <GoogleAccountSelectScreen
              onSelectAccount={handleSelectGoogleAccount}
              onBack={() => handleNavigate('register')}
            />
          } />

          <Route path="/google_consent" element={
            <GoogleConsentScreen
              email={tempGoogleEmail}
              onAllow={handleAllowGoogleConsent}
              onCancel={() => handleNavigate('google_select')}
            />
          } />

          <Route path="/onboarding" element={
            <OnboardingScreen
              user={user}
              onFinishOnboarding={handleFinishOnboarding}
              onCancel={() => handleNavigate('register')}
            />
          } />

          <Route path="/payments" element={
            <PaymentsScreen
              isLoading={isLoading}
              subscriptions={subscriptions}
              history={history}
              currency={user.preferredCurrency}
              onSelectSubscription={handleSelectSubscription}
              onAddNew={handleAddNew}
              onRecordPayment={handleRecordPayment}
              onShowToast={showToast}
            />
          } />

          <Route path="/overview" element={
            <OverviewScreen
              isLoading={isLoading}
              subscriptions={subscriptions}
              currency={user.preferredCurrency}
              monthlyBudgetGoal={user.monthlyBudgetGoal}
              onSelectSubscription={handleSelectSubscription}
              onAddNew={handleAddNew}
              onUpdateBudget={(newGoal) => {
                setUser((prev) => ({ ...prev, monthlyBudgetGoal: newGoal }));
                showToast(`Presupuesto actualizado a $${newGoal}`);
              }}
              onNavigate={(s) => handleNavigate(s)}
            />
          } />

          <Route path="/insights" element={
            <InsightsScreen
              isLoading={isLoading}
              subscriptions={subscriptions}
              currency={user.preferredCurrency}
              onSelectCategory={(cat) => {
                showToast(`Filtrando categoría: ${cat}`, 'info');
              }}
              onAddNew={handleAddNew}
              onShowToast={showToast}
            />
          } />

          <Route path="/detail" element={
            selectedSub ? (
              <SubscriptionDetailScreen
                subscription={selectedSub}
                currency={user.preferredCurrency}
                onEdit={handleEditSubscription}
                onCancelSub={handleCancelSubscription}
                onTogglePause={handleTogglePauseSubscription}
                onRecordPayment={handleRecordPayment}
                onBack={() => navigate(-1)}
              />
            ) : <Navigate to="/payments" replace />
          } />

          <Route path="/new_subscription" element={
            <NewSubscriptionModal
              subscriptionToEdit={editingSub}
              currency={user.preferredCurrency}
              onSave={handleSaveSubscription}
              onClose={() => navigate(-1)}
            />
          } />

          <Route path="/settings" element={
            <SettingsScreen
              user={user}
              subscriptions={subscriptions}
              onUpdateUser={(updated) => {
                setUser((prev) => ({ ...prev, ...updated }));
                showToast('Ajustes guardados con éxito');
              }}
              onLogout={handleLogout}
              onShowToast={showToast}
              onImportSubscriptions={(importedSubs) => {
                setSubscriptions(importedSubs);
                showToast('Datos importados con éxito');
              }}
            />
          } />
        </Routes>
      </div>

      <BottomNav currentScreen={currentScreen} onNavigate={handleNavigate} />
    </div>
  );
};
