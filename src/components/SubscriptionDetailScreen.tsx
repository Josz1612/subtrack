import React, { useState } from 'react';
import { Subscription, Currency } from '../types';
import { formatCurrency } from '../data/initialData';
import {
  Calendar,
  RotateCcw,
  CreditCard,
  Bell,
  Cloud,
  Edit,
  Trash2,
  CheckCircle2,
  Radio,
  Sparkles,
  ArrowLeft,
  Pause,
  Play,
  Check,
} from 'lucide-react';

interface SubscriptionDetailScreenProps {
  subscription: Subscription;
  currency: Currency;
  onEdit: (sub: Subscription) => void;
  onCancelSub: (subId: string) => void;
  onTogglePause?: (subId: string) => void;
  onRecordPayment?: (sub: Subscription) => void;
  onBack: () => void;
}

export const SubscriptionDetailScreen: React.FC<SubscriptionDetailScreenProps> = ({
  subscription,
  currency,
  onEdit,
  onCancelSub,
  onTogglePause,
  onRecordPayment,
  onBack,
}) => {
  const [showCancelModal, setShowCancelModal] = useState(false);

  const renderLogo = () => {
    if (subscription.logoType === 'netflix') {
      return (
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-black flex items-center justify-center shadow-md border border-[#1e293b]">
          <span className="text-[#e50914] text-4xl sm:text-5xl font-extrabold tracking-tighter">
            N
          </span>
        </div>
      );
    }
    if (subscription.logoType === 'spotify') {
      return (
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[#1DB954] flex items-center justify-center shadow-md">
          <Radio className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
        </div>
      );
    }
    if (subscription.logoType === 'icloud') {
      return (
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[#007AFF]/20 border border-[#007AFF]/40 flex items-center justify-center shadow-md">
          <Cloud className="w-10 h-10 sm:w-12 sm:h-12 text-[#38bdf8]" />
        </div>
      );
    }
    return (
      <div
        style={{ backgroundColor: subscription.iconBgColor || '#1e293b' }}
        className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl text-white flex items-center justify-center font-bold text-3xl sm:text-4xl shadow-md border border-[#334155]"
      >
        {subscription.iconLetter || subscription.name.charAt(0)}
      </div>
    );
  };

  const isPaused = subscription.status === 'paused';

  return (
    <main className="fixed sm:relative inset-x-0 bottom-0 sm:inset-auto z-50 sm:z-auto bg-[#070b14] sm:bg-transparent max-w-[480px] sm:max-w-none mx-auto w-full max-h-[95vh] sm:max-h-none overflow-y-auto sm:overflow-visible px-4 sm:px-6 py-5 sm:py-4 pb-12 sm:pb-28 flex flex-col gap-6 rounded-t-3xl sm:rounded-none animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:animate-none shadow-[0_-10px_40px_rgba(0,0,0,0.5)] sm:shadow-none border-t border-[#1e293b] sm:border-none">
      {/* Indicador de arrastre (Dragger) para móviles */}
      <div className="w-12 h-1.5 bg-[#334155] rounded-full mx-auto sm:hidden mb-1" />

      {/* Back navigation button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#94a3b8] hover:text-[#3b82f6] transition-colors p-2 rounded-xl hover:bg-[#0f172a] touch-manipulation"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al listado</span>
        </button>
      </div>

      {/* Header & Logo Section */}
      <section className="flex flex-col items-center gap-3 text-center">
        {renderLogo()}

        <div className="flex flex-col items-center gap-1.5">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#f1f5f9] tracking-tight">
            {subscription.name}
          </h1>
          <div
            className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold border ${
              isPaused
                ? 'bg-[#f59e0b]/20 text-[#fbbf24] border-[#f59e0b]/40'
                : 'bg-[#14291e] text-[#4ade80] border-[#4ade80]/30'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${isPaused ? 'bg-[#f59e0b]' : 'bg-[#4ade80]'}`}
            />
            <span>{isPaused ? 'Pausada' : 'Activa'}</span>
          </div>
        </div>

        {/* Pricing Card */}
        <div className="w-full bg-[#0f172a] rounded-[24px] p-6 sm:p-7 shadow-subtrack border border-[#1e293b] text-center flex flex-col items-center justify-center gap-1 mt-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#3b82f6]/10 rounded-full blur-3xl pointer-events-none" />

          <p className="text-xs font-bold uppercase tracking-wider text-[#94a3b8]">
            {subscription.planName || 'Plan Estándar'}
          </p>
          <div className="text-3xl sm:text-4xl font-extrabold text-[#3b82f6] tracking-tight">
            {formatCurrency(subscription.amount, currency)}
          </div>
          <p className="text-xs text-[#94a3b8]">
            {subscription.billingCycle === 'monthly'
              ? 'por mes'
              : subscription.billingCycle === 'yearly'
              ? 'por año'
              : 'por semana'}
          </p>

          <div className="mt-3 flex items-center gap-2 bg-[#131d35] py-2 px-4 rounded-full text-xs font-semibold text-[#f1f5f9] border border-[#1e293b]">
            <Calendar className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>
              Próximo cobro: {subscription.nextPaymentDate.replace('2026-', '').replace('-', '/')}
            </span>
          </div>
        </div>
      </section>

      {/* Subscription Details Card */}
      <section className="bg-[#0f172a] rounded-2xl border border-[#1e293b] shadow-subtrack p-5 sm:p-6 flex flex-col gap-4">
        <h3 className="text-sm font-bold text-[#f1f5f9] border-b border-[#1e293b] pb-3">
          Detalles de la Suscripción
        </h3>

        <div className="divide-y divide-[#1e293b] space-y-3">
          <div className="flex justify-between items-center pt-2 first:pt-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#131d35] flex items-center justify-center text-[#60a5fa] border border-[#1e293b]">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-[#94a3b8]">Próximo Pago</span>
            </div>
            <span className="text-xs font-bold text-[#f1f5f9]">
              {subscription.nextPaymentDate}
            </span>
          </div>

          <div className="flex justify-between items-center pt-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#131d35] flex items-center justify-center text-[#60a5fa] border border-[#1e293b]">
                <RotateCcw className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-[#94a3b8]">Ciclo de Facturación</span>
            </div>
            <span className="text-xs font-bold text-[#f1f5f9] capitalize">
              {subscription.billingCycle === 'monthly' ? 'Mensual' : 'Anual'}
            </span>
          </div>

          {subscription.planName && (
            <div className="flex justify-between items-center pt-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#131d35] flex items-center justify-center text-[#60a5fa] border border-[#1e293b]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-[#94a3b8]">Plan</span>
              </div>
              <span className="text-xs font-bold text-[#f1f5f9]">{subscription.planName}</span>
            </div>
          )}

          <div className="flex justify-between items-center pt-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#131d35] flex items-center justify-center text-[#60a5fa] border border-[#1e293b]">
                <CreditCard className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-[#94a3b8]">Método de Pago</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#f1f5f9]">
              <span className="px-2 py-0.5 bg-[#131d35] rounded-md text-[10px] text-[#94a3b8] border border-[#1e293b]">
                {subscription.paymentMethod.type}
              </span>
              <span>•••• {subscription.paymentMethod.last4}</span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#131d35] flex items-center justify-center text-[#60a5fa] border border-[#1e293b]">
                <Bell className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-[#94a3b8]">Recordatorio</span>
            </div>
            <span className="text-xs font-bold text-[#f1f5f9]">
              {subscription.reminderDays}{' '}
              {subscription.reminderDays === 1 ? 'día antes' : 'días antes'}
            </span>
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
        {onRecordPayment && (
          <button
            onClick={() => onRecordPayment(subscription)}
            className="w-full bg-[#1e3a8a]/60 hover:bg-[#1e3a8a] text-[#93c5fd] hover:text-white border border-[#3b82f6]/40 py-3.5 rounded-xl font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 min-h-[48px] touch-manipulation"
          >
            <CheckCircle2 className="w-4 h-4 text-[#38bdf8]" />
            <span>Registrar Pago Ahora</span>
          </button>
        )}

        {onTogglePause && (
          <button
            onClick={() => onTogglePause(subscription.id)}
            className="w-full bg-[#0f172a] hover:bg-[#1e293b] border border-[#334155] text-[#f1f5f9] py-3.5 rounded-xl font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 min-h-[48px] touch-manipulation"
          >
            {isPaused ? <Play className="w-4 h-4 text-[#4ade80]" /> : <Pause className="w-4 h-4 text-[#f59e0b]" />}
            <span>{isPaused ? 'Reanudar Suscripción' : 'Pausar Suscripción'}</span>
          </button>
        )}

        <button
          onClick={() => onEdit(subscription)}
          className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white py-3.5 rounded-xl font-bold text-xs sm:text-sm shadow-blue-glow transition-all active:scale-[0.98] flex items-center justify-center gap-2 min-h-[48px] touch-manipulation"
        >
          <Edit className="w-4 h-4" />
          <span>Editar Suscripción</span>
        </button>

        <button
          onClick={() => setShowCancelModal(true)}
          className="w-full bg-transparent border border-[#ef4444]/40 text-[#ef4444] hover:bg-[#ef4444]/10 py-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 min-h-[48px] touch-manipulation"
        >
          <Trash2 className="w-4 h-4" />
          <span>Eliminar Suscripción</span>
        </button>
      </section>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0f172a] rounded-2xl p-6 max-w-sm w-full shadow-subtrack-lg border border-[#1e293b] text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/30 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#f1f5f9] mb-1">¿Eliminar suscripción?</h3>
            <p className="text-xs text-[#94a3b8] mb-6 leading-relaxed">
              Se eliminará permanentemente <strong>{subscription.name}</strong> y sus recordatorios de cobro.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#334155] text-xs font-semibold text-[#f1f5f9] hover:bg-[#1e293b]"
              >
                No, mantener
              </button>
              <button
                onClick={() => {
                  onCancelSub(subscription.id);
                  setShowCancelModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#ef4444] text-white text-xs font-bold hover:bg-[#dc2626] shadow-sm"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

