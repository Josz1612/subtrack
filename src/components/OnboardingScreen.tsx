import React, { useState } from 'react';
import { SubTrackLogo } from './SubTrackLogo';
import { Currency, UserProfile } from '../types';
import { User, Mail, DollarSign, ArrowRight, Info, CheckCircle2 } from 'lucide-react';

interface OnboardingScreenProps {
  user: UserProfile;
  onFinishOnboarding: (data: {
    name: string;
    preferredCurrency: Currency;
    monthlyBudgetGoal: number;
  }) => void;
  onCancel: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  user,
  onFinishOnboarding,
  onCancel,
}) => {
  const [name, setName] = useState(user.name);
  const [currency, setCurrency] = useState<Currency>(user.preferredCurrency);
  const [budget, setBudget] = useState<string>(user.monthlyBudgetGoal.toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFinishOnboarding({
      name: name || user.name,
      preferredCurrency: currency,
      monthlyBudgetGoal: parseFloat(budget) || 150,
    });
  };

  return (
    <div className="min-h-screen bg-[#070b14] flex flex-col justify-center items-center py-8 px-4 sm:px-6">
      <div className="w-full max-w-[480px] flex flex-col gap-6">
        {/* Header */}
        <header className="flex flex-col items-center text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#131d35] p-2 shadow-blue-glow border border-[#1e293b] flex items-center justify-center mb-4">
            <SubTrackLogo size={60} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#f1f5f9] mb-1.5">
            ¡Bienvenido!
          </h1>
          <p className="text-xs sm:text-sm text-[#94a3b8]">
            Termina de configurar tu cuenta para empezar a organizar tus suscripciones.
          </p>
        </header>

        {/* Progress Indicator */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center px-1 text-xs">
            <span className="font-semibold text-[#64748b]">Paso 1 de 2</span>
            <span className="font-bold text-[#3b82f6]">Detalles básicos</span>
          </div>
          <div className="h-2 w-full bg-[#131d35] rounded-full overflow-hidden border border-[#1e293b]">
            <div className="h-full bg-[#3b82f6] w-1/2 rounded-full transition-all duration-500 shadow-blue-glow" />
          </div>
        </div>

        {/* Form Container */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#0f172a] rounded-2xl shadow-subtrack border border-[#1e293b] p-6 flex flex-col gap-4"
        >
          {/* Pre-filled info from Google */}
          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">
                Nombre Completo
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748b]" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#131d35] border border-[#1e293b] rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm text-[#f1f5f9] focus:outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 min-h-[44px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748b]" />
                <input
                  type="email"
                  value={user.email}
                  readOnly
                  className="w-full bg-[#131d35]/60 border border-[#1e293b] rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm text-[#64748b] cursor-not-allowed min-h-[44px]"
                />
              </div>
              <p className="text-[11px] text-[#64748b] flex items-center gap-1 mt-1.5">
                <Info className="w-3.5 h-3.5 text-[#3b82f6]" />
                <span>Información importada de tu cuenta</span>
              </p>
            </div>
          </div>

          <hr className="border-t border-[#1e293b] my-1" />

          {/* Configuration */}
          <div className="flex flex-col gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">
                Moneda Principal
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="w-full bg-[#131d35] border border-[#1e293b] rounded-xl py-2.5 px-4 text-xs sm:text-sm text-[#f1f5f9] focus:outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 min-h-[44px]"
              >
                <option value="USD">USD ($) - Dólar Estadounidense</option>
                <option value="EUR">EUR (€) - Euro</option>
                <option value="MXN">MXN ($) - Peso Mexicano</option>
                <option value="GBP">GBP (£) - Libra Esterlina</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">
                Meta de Presupuesto Mensual <span className="text-[#64748b] font-normal">(Opcional)</span>
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748b] text-xs font-bold">
                  $
                </div>
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="150.00"
                  className="w-full bg-[#131d35] border border-[#1e293b] rounded-xl py-2.5 pl-8 pr-4 text-xs sm:text-sm text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 min-h-[44px]"
                />
              </div>
              <p className="text-[11px] text-[#64748b] mt-1">
                Te notificaremos cuando tus suscripciones se acerquen a este límite.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2.5 mt-4">
            <button
              type="submit"
              className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold py-3.5 rounded-xl flex justify-center items-center gap-2 shadow-blue-glow active:scale-[0.98] transition-all min-h-[48px] touch-manipulation cursor-pointer"
            >
              <span>Continuar a SubTrack</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="w-full bg-transparent text-[#94a3b8] hover:text-[#3b82f6] text-xs font-semibold py-2.5 rounded-xl hover:bg-[#131d35] transition-colors min-h-[40px] touch-manipulation"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
