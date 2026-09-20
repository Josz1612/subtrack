import React, { useState, useEffect } from 'react';
import { GOOGLE_ICON_URL, APPLE_ICON_URL } from '../data/initialData';
import { SubTrackLogo } from './SubTrackLogo';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Preferences } from '@capacitor/preferences';
import { NativeBiometric } from '@capgo/capacitor-native-biometric';

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onGoToRegister: () => void;
  onGoogleSignIn: () => void;
  onAppleSignIn: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onGoToRegister,
  onGoogleSignIn,
  onAppleSignIn,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isCheckingBiometrics, setIsCheckingBiometrics] = useState(true);

  useEffect(() => {
    const checkBiometric = async () => {
      try {
        const pref = await Preferences.get({ key: 'isBiometricEnabled' });
        if (pref.value === 'true') {
          await NativeBiometric.verifyIdentity({
            reason: 'Desbloquea SubTrack para ver tus suscripciones',
            title: 'Autenticación requerida',
          });
          
          await Preferences.set({ key: 'isLoggedIn', value: 'true' });
          onLoginSuccess();
        } else {
          setIsCheckingBiometrics(false);
        }
      } catch (err) {
        // Falló o fue cancelado, continuar al login normal
        console.log('Biometric auth failed or canceled', err);
        setIsCheckingBiometrics(false);
      }
    };
    checkBiometric();
  }, [onLoginSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Por favor completa tu correo electrónico y contraseña.');
      return;
    }

    try {
      const savedEmailPref = await Preferences.get({ key: 'subtrack_local_email' });
      const savedPasswordPref = await Preferences.get({ key: 'subtrack_local_password' });

      if (savedEmailPref.value === email && savedPasswordPref.value === password) {
        // Credenciales correctas
        await Preferences.set({ key: 'isLoggedIn', value: 'true' });
        onLoginSuccess();
      } else {
        setError('Correo o contraseña incorrectos.');
      }
    } catch (err) {
      setError('Ocurrió un error al intentar iniciar sesión.');
    }
  };

  if (isCheckingBiometrics) {
    return (
      <div className="min-h-screen bg-[#070b14] flex flex-col items-center justify-center p-4">
        <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-blue-glow bg-[#131d35] p-3 border border-[#1e293b] flex items-center justify-center animate-pulse">
          <SubTrackLogo size={70} />
        </div>
        <div className="mt-8 text-[#94a3b8] text-sm font-semibold animate-pulse">
          Verificando identidad...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b14] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#3b82f6]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#0284c7]/10 blur-3xl pointer-events-none" />

      <main className="w-full max-w-[460px] bg-[#0f172a] rounded-3xl shadow-subtrack-lg p-6 sm:p-8 relative z-10 border border-[#1e293b]">
        <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
          <div className="w-20 h-20 rounded-2xl overflow-hidden mb-4 shadow-blue-glow bg-[#131d35] p-2 border border-[#1e293b] flex items-center justify-center">
            <SubTrackLogo size={64} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#f1f5f9] tracking-tight mb-1.5">
            Bienvenido de nuevo
          </h1>
          <p className="text-xs sm:text-sm text-[#94a3b8]">
            Ingresa para gestionar tus suscripciones
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-[#2a1215] border border-[#ef4444]/40 text-[#f87171] text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
                className="w-full bg-[#131d35] border border-[#1e293b] rounded-xl py-3 pl-11 pr-12 text-xs sm:text-sm text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 transition-all min-h-[46px]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#94a3b8] p-1 touch-manipulation"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={!email.trim() || !password}
            className={`w-full text-white text-sm font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 mt-6 min-h-[52px] touch-manipulation ${
              !email.trim() || !password
                ? 'bg-[#334155] cursor-not-allowed opacity-50'
                : 'bg-[#3b82f6] hover:bg-[#2563eb] shadow-blue-glow active:scale-95'
            }`}
          >
            <span>Iniciar Sesión</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>



        <p className="text-center mt-6 text-xs text-[#94a3b8]">
          ¿No tienes una cuenta?{' '}
          <button
            onClick={onGoToRegister}
            className="font-bold text-[#3b82f6] hover:text-[#60a5fa] hover:underline touch-manipulation p-1 -m-1"
          >
            Regístrate
          </button>
        </p>
      </main>
    </div>
  );
};
