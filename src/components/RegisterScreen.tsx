import React, { useState } from 'react';
import { GOOGLE_ICON_URL, APPLE_ICON_URL } from '../data/initialData';
import { SubTrackLogo } from './SubTrackLogo';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import { Preferences } from '@capacitor/preferences';

interface RegisterScreenProps {
  onRegisterSubmit: (name: string, email: string) => void;
  onGoogleSignIn: () => void;
  onAppleSignIn: () => void;
  onGoToSignIn: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onRegisterSubmit,
  onGoogleSignIn,
  onAppleSignIn,
  onGoToSignIn,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password) {
      setError('Por favor completa todos los campos requeridos.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      const userData = { email, password, name: fullName };
      await Preferences.set({ key: 'user_account', value: JSON.stringify(userData) });
      await Preferences.set({ key: 'isLoggedIn', value: 'true' });
      
      onRegisterSubmit(fullName, email);
    } catch (err) {
      setError('Ocurrió un error al guardar las credenciales.');
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Soft ambient background glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#3b82f6]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#0284c7]/10 blur-3xl pointer-events-none" />

      <main className="w-full max-w-[460px] bg-[#0f172a] rounded-3xl shadow-subtrack-lg p-6 sm:p-8 relative z-10 border border-[#1e293b]">
        {/* Header / Logo Area */}
        <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
          <div className="w-20 h-20 rounded-2xl overflow-hidden mb-4 shadow-blue-glow bg-[#131d35] p-2 border border-[#1e293b] flex items-center justify-center">
            <SubTrackLogo size={64} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#f1f5f9] tracking-tight mb-1.5">
            Crea tu cuenta
          </h1>
          <p className="text-xs sm:text-sm text-[#94a3b8]">
            Gestiona tus gastos recurrentes y suscripciones de forma inteligente
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-[#2a1215] border border-[#ef4444]/40 text-[#f87171] text-xs font-semibold text-center">
            {error}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#cbd5e1]" htmlFor="fullName">
              Nombre completo
            </label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748b]" />
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ej. Alex Smith"
                className="w-full bg-[#131d35] border border-[#1e293b] rounded-xl py-3 pl-11 pr-4 text-xs sm:text-sm text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 transition-all min-h-[46px]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#cbd5e1]" htmlFor="email">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748b]" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full bg-[#131d35] border border-[#1e293b] rounded-xl py-3 pl-11 pr-4 text-xs sm:text-sm text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 transition-all min-h-[46px]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#cbd5e1]" htmlFor="password">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748b]" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#131d35] border border-[#1e293b] rounded-xl py-3 pl-11 pr-11 text-xs sm:text-sm text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 transition-all min-h-[46px]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#3b82f6] p-1 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
                aria-label="Ver contraseña"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#cbd5e1]" htmlFor="confirmPassword">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748b]" />
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#131d35] border border-[#1e293b] rounded-xl py-3 pl-11 pr-4 text-xs sm:text-sm text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 transition-all min-h-[46px]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!fullName.trim() || !email.trim() || !password || !confirmPassword || password !== confirmPassword}
            className={`w-full text-white font-bold text-sm sm:text-base py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all mt-6 min-h-[48px] touch-manipulation ${
              !fullName.trim() || !email.trim() || !password || !confirmPassword || password !== confirmPassword
                ? 'bg-[#334155] cursor-not-allowed opacity-50'
                : 'bg-[#3b82f6] hover:bg-[#2563eb] shadow-blue-glow active:scale-[0.98]'
            }`}
          >
            <span>Crear Cuenta</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>



        {/* Footer Link */}
        <div className="text-center mt-6 flex items-center justify-center gap-1.5">
          <span className="text-xs text-[#94a3b8]">¿Ya tienes una cuenta?</span>
          <button
            type="button"
            onClick={onGoToSignIn}
            className="text-xs font-bold text-[#3b82f6] hover:text-[#60a5fa] hover:underline p-1 min-h-[36px]"
          >
            Iniciar Sesión
          </button>
        </div>
      </main>
    </div>
  );
};
