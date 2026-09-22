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
import { LoginScreen } from './components/LoginScreen';
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
import { Preferences } from '@capacitor/preferences';
import { LocalNotifications } from '@capacitor/local-notifications';
import { CapacitorCalendar } from '@capgo/capacitor-calendar';
import { AnimatePresence } from 'framer-motion';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentScreen = location.pathname.substring(1) || 'payments';

  const [selectedSub, setSelectedSub] = useState<Subscription | null>(INITIAL_SUBSCRIPTIONS[0]);
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);
  const [tempGoogleEmail, setTempGoogleEmail] = useState<string>('alex.smith@gmail.com');
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load / Persist State
  const [user, setUser] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(INITIAL_SUBSCRIPTIONS);
  const [history, setHistory] = useState<PaymentHistoryItem[]>(INITIAL_PAYMENT_HISTORY);

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const authPref = await Preferences.get({ key: 'isLoggedIn' });
        const bioPref = await Preferences.get({ key: 'isBiometricEnabled' });
        
        if (authPref.value === 'true' && bioPref.value !== 'true') {
          setIsAuthenticated(true);
        }

        const userPref = await Preferences.get({ key: 'subtrack_user' });
        let parsedUser = userPref.value ? JSON.parse(userPref.value) : INITIAL_USER_PROFILE;
        
        // Saneamiento: si el presupuesto es corrupto (< 1), forzar a 3000 MXN
        if (!parsedUser.monthlyBudgetGoal || parsedUser.monthlyBudgetGoal < 1) {
          parsedUser.monthlyBudgetGoal = 3000.0;
        }

        const { value } = await Preferences.get({ key: 'user_account' });
        if (value) {
          if (value === 'undefined' || value === 'null' || value === '[object Object]') {
            throw new Error('Datos inválidos');
          }
          try {
            const accountData = JSON.parse(value);
            parsedUser.name = accountData.name || parsedUser.name;
          } catch (parseError) {
            await Preferences.remove({ key: 'user_account' });
            throw new Error('Corrupción de JSON eliminada');
          }
        }

        setUser(parsedUser);

        const subsPref = await Preferences.get({ key: 'subtrack_subscriptions' });
        if (subsPref.value) setSubscriptions(JSON.parse(subsPref.value));

        const histPref = await Preferences.get({ key: 'subtrack_history' });
        if (histPref.value) setHistory(JSON.parse(histPref.value));
      } catch (error) {
        console.error('Error loading preferences:', error);
        setUser(INITIAL_USER_PROFILE);
        setIsAuthenticated(false);
      } finally {
        setIsInitializing(false);
      }
    };
    loadPreferences();
  }, []);

  // Save state on change
  useEffect(() => {
    if (!isInitializing) {
      Preferences.set({ key: 'subtrack_user', value: JSON.stringify(user) });
    }
  }, [user, isInitializing]);

  useEffect(() => {
    const requestNotifPermissions = async () => {
      try {
        await LocalNotifications.requestPermissions();
      } catch (err) {
        console.log("LocalNotifications permissions error:", err);
      }
    };
    requestNotifPermissions();
  }, []);

  const schedulePaymentNotifications = async (subs: Subscription[]) => {
    try {
      const pending = await LocalNotifications.getPending();
      if (pending.notifications.length > 0) {
        await LocalNotifications.cancel(pending);
      }

      const activeSubs = subs.filter(s => s.status === 'active');
      const notificationsToSchedule = activeSubs.map((sub, index) => {
        const notifDate = new Date(sub.nextPaymentDate);
        notifDate.setDate(notifDate.getDate() - 1); // 1 día antes
        notifDate.setHours(10, 0, 0, 0); // a las 10:00 AM

        // Si la fecha ya pasó, no la programamos (se asume que nextPaymentDate avanzará cuando pague)
        if (notifDate.getTime() < Date.now()) {
          notifDate.setMonth(notifDate.getMonth() + 1);
        }

        return {
          id: index + 1,
          title: `Pago próximo: ${sub.name}`,
          body: `Se cobrarán ${sub.amount} mañana.`,
          schedule: { at: notifDate }
        };
      });

      if (notificationsToSchedule.length > 0) {
        await LocalNotifications.schedule({ notifications: notificationsToSchedule });
      }
    } catch (e) {
      console.log('Error scheduling notifications', e);
    }
  };

  useEffect(() => {
    if (!isInitializing) {
      Preferences.set({ key: 'subtrack_subscriptions', value: JSON.stringify(subscriptions) });
      schedulePaymentNotifications(subscriptions);
    }
  }, [subscriptions, isInitializing]);

  useEffect(() => {
    if (!isInitializing) {
      Preferences.set({ key: 'subtrack_history', value: JSON.stringify(history) });
    }
  }, [history, isInitializing]);

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

    if (target) {
      (async () => {
        try {
          const from = new Date(target.nextPaymentDate).getTime() - 86400000;
          const to = new Date(target.nextPaymentDate).getTime() + 86400000 * 2;
          const { result } = await CapacitorCalendar.listEventsInRange({ from, to });
          const event = result.find((e: any) => e.title === 'Pago de ' + target.name);
          if (event) {
            await CapacitorCalendar.deleteEvent({ id: event.id });
          }
        } catch (e) {
          console.log('Error deleting calendar event', e);
        }
      })();
    }
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

          (async () => {
            try {
              if (newStatus === 'paused') {
                const from = new Date(s.nextPaymentDate).getTime() - 86400000;
                const to = new Date(s.nextPaymentDate).getTime() + 86400000 * 2;
                const { result } = await CapacitorCalendar.listEventsInRange({ from, to });
                const event = result.find((e: any) => e.title === 'Pago de ' + s.name);
                if (event) {
                  await CapacitorCalendar.deleteEvent({ id: event.id });
                }
              }
            } catch (e) {
              console.log('Error pausing calendar event', e);
            }
          })();

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

    // Advance next payment date based on the existing due date
    const nextDate = new Date(sub.nextPaymentDate + 'T12:00:00');
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

    (async () => {
      try {
        const from = new Date(sub.nextPaymentDate).getTime() - 86400000;
        const to = new Date(sub.nextPaymentDate).getTime() + 86400000 * 2;
        const { result } = await CapacitorCalendar.listEventsInRange({ from, to });
        const event = result.find((e: any) => e.title === 'Pago de ' + sub.name);
        
        if (event) {
          await CapacitorCalendar.modifyEvent({ 
            id: event.id,
            title: 'Pagado: ' + sub.name
          });
        }

        const newStartDate = new Date(nextDateStr).getTime();
        const newEndDate = newStartDate + 3600000; // +1 hour
        await CapacitorCalendar.createEvent({
          title: 'Pago de ' + sub.name,
          startDate: newStartDate,
          endDate: newEndDate,
        });
      } catch (e) {
        console.log('Error updating calendar for payment', e);
      }
    })();
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

  const handleLogout = async () => {
    await Preferences.remove({ key: 'isLoggedIn' });
    setIsAuthenticated(false);
    showToast('Sesión cerrada correctamente', 'info');
    handleNavigate('login');
  };

  if (isInitializing) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900 text-white text-xl">Cargando...</div>
    );
  }

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

      {isAuthenticated && (
        <Header
          user={user}
          onAddNew={handleAddNew}
          onShowToast={showToast}
        />
      )}

      {/* Main Screen Views with Responsive Container */}
      <div className="flex-1 w-full max-w-[768px] lg:max-w-[1024px] mx-auto relative pb-24">

        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Navigate to={isAuthenticated ? "/payments" : "/login"} replace />} />

          {/* Auth Routes */}
          <Route path="/login" element={
            !isAuthenticated ? (
              <LoginScreen
                onLoginSuccess={() => {
                  setIsAuthenticated(true);
                  handleNavigate('payments');
                }}
                onGoToRegister={() => handleNavigate('register')}
                onGoogleSignIn={handleGoogleSignIn}
                onAppleSignIn={() => handleNavigate('onboarding')}
              />
            ) : <Navigate to="/payments" replace />
          } />

          <Route path="/register" element={
            !isAuthenticated ? (
              <RegisterScreen
                onRegisterSubmit={(name, email) => {
                  handleRegisterSubmit(name, email);
                  setIsAuthenticated(true);
                  handleNavigate('payments');
                }}
                onGoogleSignIn={handleGoogleSignIn}
                onAppleSignIn={() => handleNavigate('onboarding')}
                onGoToSignIn={() => handleNavigate('login')}
              />
            ) : <Navigate to="/payments" replace />
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

          {/* Protected Routes */}
          <Route path="/payments" element={
            isAuthenticated ? (
              <PaymentsScreen
                isLoading={isInitializing}
                subscriptions={subscriptions}
                history={history}
                currency={user.preferredCurrency}
                onSelectSubscription={handleSelectSubscription}
                onAddNew={handleAddNew}
                onRecordPayment={handleRecordPayment}
                onShowToast={showToast}
              />
            ) : <Navigate to="/login" replace />
          } />

          <Route path="/overview" element={
            isAuthenticated ? (
              <OverviewScreen
                isLoading={isInitializing}
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
                onEditSubscription={handleEditSubscription}
                onDeleteSubscription={handleCancelSubscription}
              />
            ) : <Navigate to="/login" replace />
          } />

          <Route path="/insights" element={
            isAuthenticated ? (
              <InsightsScreen
                isLoading={isInitializing}
                subscriptions={subscriptions}
                history={history}
                currency={user.preferredCurrency}
                onSelectCategory={(cat) => {
                  showToast(`Filtrando categoría: ${cat}`, 'info');
                }}
                onAddNew={handleAddNew}
                onShowToast={showToast}
              />
            ) : <Navigate to="/login" replace />
          } />

          <Route path="/detail" element={
            isAuthenticated ? (
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
            ) : <Navigate to="/login" replace />
          } />

          <Route path="/new_subscription" element={
            isAuthenticated ? (
              <NewSubscriptionModal
                subscriptionToEdit={editingSub}
                currency={user.preferredCurrency}
                onSave={handleSaveSubscription}
                onClose={() => navigate(-1)}
              />
            ) : <Navigate to="/login" replace />
          } />

          <Route path="/settings" element={
            isAuthenticated ? (
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
            ) : <Navigate to="/login" replace />
          } />
        </Routes>
        </AnimatePresence>
      </div>

      {isAuthenticated && <BottomNav currentScreen={currentScreen} onNavigate={handleNavigate} />}
    </div>
  );
};
