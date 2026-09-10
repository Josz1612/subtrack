import React, { useState, useEffect } from 'react';
import { Subscription, Category, Currency, BillingCycle } from '../types';
import { POPULAR_PRESETS } from '../data/initialData';
import { SubTrackLogo } from './SubTrackLogo';
import { X, Search, Dumbbell, Save, Plus } from 'lucide-react';

interface NewSubscriptionModalProps {
  subscriptionToEdit?: Subscription | null;
  currency: Currency;
  onSave: (sub: Omit<Subscription, 'id'>, id?: string) => void;
  onClose: () => void;
}

export const NewSubscriptionModal: React.FC<NewSubscriptionModalProps> = ({
  subscriptionToEdit,
  currency,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState<string>('0.00');
  const [subCurrency, setSubCurrency] = useState<Currency>(currency);
  const [category, setCategory] = useState<Category>('Entertainment');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [nextPaymentDate, setNextPaymentDate] = useState<string>('2026-11-20');
  const [planName, setPlanName] = useState<string>('');
  const [reminderDays, setReminderDays] = useState<number>(3);
  const [cardLast4, setCardLast4] = useState<string>('4242');
  const [cardType, setCardType] = useState<'VISA' | 'MASTERCARD' | 'APPLE_PAY'>('VISA');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (subscriptionToEdit) {
      setName(subscriptionToEdit.name);
      setAmount(subscriptionToEdit.amount.toString());
      setSubCurrency(subscriptionToEdit.currency);
      setCategory(subscriptionToEdit.category);
      setBillingCycle(subscriptionToEdit.billingCycle);
      setNextPaymentDate(subscriptionToEdit.nextPaymentDate);
      setPlanName(subscriptionToEdit.planName || '');
      setReminderDays(subscriptionToEdit.reminderDays || 3);
      setCardLast4(subscriptionToEdit.paymentMethod?.last4 || '4242');
      setCardType((subscriptionToEdit.paymentMethod?.type as any) || 'VISA');
    }
  }, [subscriptionToEdit]);

  const handleSelectPreset = (preset: (typeof POPULAR_PRESETS)[0]) => {
    setName(preset.name);
    setAmount(preset.amount.toString());
    setCategory(preset.category);
    setBillingCycle(preset.billingCycle);
    setPlanName(preset.defaultPlan);
  };

  const filteredPresets = POPULAR_PRESETS.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedAmount = parseFloat(amount) || 0;

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

    onSave(
      {
        name,
        amount: parsedAmount,
        currency: subCurrency,
        category,
        billingCycle,
        nextPaymentDate,
        planName,
        reminderDays,
        status: 'active',
        paymentMethod: {
          type: cardType,
          last4: cardLast4,
        },
        logoType,
        iconLetter: iconLtr,
        iconBgColor: iconBg,
      },
      subscriptionToEdit?.id
    );
  };

  return (
    <main className="fixed sm:relative inset-x-0 bottom-0 sm:inset-auto z-50 sm:z-auto bg-[#0f172a] sm:bg-transparent max-w-[480px] sm:max-w-none mx-auto w-full max-h-[90vh] sm:max-h-none overflow-y-auto sm:overflow-visible px-4 sm:px-6 py-5 sm:py-4 pb-12 sm:pb-28 flex flex-col gap-6 rounded-t-3xl sm:rounded-none animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:animate-none shadow-[0_-10px_40px_rgba(0,0,0,0.5)] sm:shadow-none">
      {/* Indicador de arrastre (Dragger) para móviles */}
      <div className="w-12 h-1.5 bg-[#334155] rounded-full mx-auto sm:hidden mb-2" />

      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
        <button
          onClick={onClose}
          className="p-2 rounded-xl hover:bg-[#1e293b] text-[#94a3b8] hover:text-white transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>
        <h1 className="text-xl sm:text-2xl font-bold text-[#f1f5f9] tracking-tight">
          {subscriptionToEdit ? 'Editar Suscripción' : 'Nueva Suscripción'}
        </h1>
        <div className="w-9 h-9 rounded-xl bg-[#131d35] p-0.5 border border-[#1e293b] flex items-center justify-center overflow-hidden">
          <SubTrackLogo size={30} />
        </div>
      </div>

      {/* Popular Presets */}
      {!subscriptionToEdit && (
        <section className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748b]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar servicios populares..."
              className="w-full bg-[#0f172a] border border-[#1e293b] rounded-xl py-3 pl-10 pr-4 text-xs sm:text-sm text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
            />
          </div>

          <div>
            <h2 className="text-xs sm:text-sm font-bold text-[#f1f5f9] mb-3">Servicios Populares</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {filteredPresets.slice(0, 8).map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`bg-[#0f172a] border rounded-2xl p-3 flex flex-col items-center justify-center gap-2 transition-all hover:bg-[#1e293b] active:scale-95 shadow-sm touch-manipulation min-h-[80px] ${
                    name === preset.name ? 'border-[#3b82f6] bg-[#131d35]' : 'border-[#1e293b]'
                  }`}
                >
                  <div
                    style={{ backgroundColor: preset.iconBgColor }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm"
                  >
                    {preset.logoType === 'gym' ? (
                      <Dumbbell className="w-4 h-4" />
                    ) : (
                      preset.iconLetter
                    )}
                  </div>
                  <span className="text-xs font-bold text-[#f1f5f9] truncate w-full text-center">
                    {preset.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Custom Details Form */}
      <section className="bg-[#0f172a] rounded-2xl p-5 sm:p-6 shadow-subtrack border border-[#1e293b]">
        <h2 className="text-sm font-bold text-[#f1f5f9] mb-4">Detalles Personalizados</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#94a3b8]">Nombre del Servicio</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Netflix, Spotify, Canva"
              className="w-full bg-[#131d35] border border-[#1e293b] rounded-xl py-3 px-3.5 text-sm text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:border-[#3b82f6]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[#94a3b8]">Monto</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-[#131d35] border border-[#1e293b] rounded-xl py-3 px-3.5 text-sm font-bold text-right text-[#f1f5f9] focus:outline-none focus:border-[#3b82f6]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[#94a3b8]">Moneda</label>
              <select
                value={subCurrency}
                onChange={(e) => setSubCurrency(e.target.value as Currency)}
                className="w-full bg-[#131d35] border border-[#1e293b] rounded-xl py-3 px-3.5 text-sm text-[#f1f5f9] focus:outline-none focus:border-[#3b82f6]"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="MXN">MXN ($)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[#94a3b8]">Categoría</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full bg-[#131d35] border border-[#1e293b] rounded-xl py-3 px-3.5 text-sm text-[#f1f5f9] focus:outline-none focus:border-[#3b82f6]"
              >
                <option value="Entertainment">Entertainment</option>
                <option value="Productivity">Productivity</option>
                <option value="Utilities">Utilities</option>
                <option value="Health">Health & Fitness</option>
                <option value="Developer">Developer</option>
                <option value="Other">Otro</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[#94a3b8]">
                Ciclo de Facturación
              </label>
              <select
                value={billingCycle}
                onChange={(e) => setBillingCycle(e.target.value as BillingCycle)}
                className="w-full bg-[#131d35] border border-[#1e293b] rounded-xl py-3 px-3.5 text-sm text-[#f1f5f9] focus:outline-none focus:border-[#3b82f6]"
              >
                <option value="monthly">Mensual</option>
                <option value="yearly">Anual</option>
                <option value="weekly">Semanal</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[#94a3b8]">Próximo Pago</label>
              <input
                type="date"
                required
                value={nextPaymentDate}
                onChange={(e) => setNextPaymentDate(e.target.value)}
                className="w-full bg-[#131d35] border border-[#1e293b] rounded-xl py-3 px-3 text-xs sm:text-sm text-[#f1f5f9] focus:outline-none focus:border-[#3b82f6]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[#94a3b8]">Plan / Paquete</label>
              <input
                type="text"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                placeholder="Ej. Individual, 4K, Pro"
                className="w-full bg-[#131d35] border border-[#1e293b] rounded-xl py-3 px-3.5 text-sm text-[#f1f5f9] focus:outline-none focus:border-[#3b82f6]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[#94a3b8]">Recordatorio</label>
              <select
                value={reminderDays}
                onChange={(e) => setReminderDays(Number(e.target.value))}
                className="w-full bg-[#131d35] border border-[#1e293b] rounded-xl py-3 px-3.5 text-sm text-[#f1f5f9] focus:outline-none focus:border-[#3b82f6]"
              >
                <option value={1}>1 día antes</option>
                <option value={2}>2 días antes</option>
                <option value={3}>3 días antes</option>
                <option value={7}>7 días antes</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[#94a3b8]">Últimos 4 dígitos</label>
              <input
                type="text"
                maxLength={4}
                value={cardLast4}
                onChange={(e) => setCardLast4(e.target.value)}
                placeholder="4242"
                className="w-full bg-[#131d35] border border-[#1e293b] rounded-xl py-3 px-3.5 text-sm text-[#f1f5f9] focus:outline-none focus:border-[#3b82f6]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white py-3.5 rounded-xl font-bold text-sm shadow-blue-glow transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4 min-h-[48px] touch-manipulation"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Suscripción</span>
          </button>
        </form>
      </section>
    </main>
  );
};
