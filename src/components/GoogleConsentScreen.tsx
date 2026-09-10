import React from 'react';
import { GOOGLE_ICON_URL } from '../data/initialData';
import { SubTrackLogo } from './SubTrackLogo';
import { ArrowLeftRight, Mail, UserCheck, ShieldCheck } from 'lucide-react';

interface GoogleConsentScreenProps {
  email: string;
  onAllow: () => void;
  onCancel: () => void;
}

export const GoogleConsentScreen: React.FC<GoogleConsentScreenProps> = ({
  email,
  onAllow,
  onCancel,
}) => {
  return (
    <div className="min-h-screen bg-[#070b14] flex flex-col items-center justify-center p-4 sm:p-6">
      <main className="w-full max-w-[440px] flex flex-col items-center">
        {/* Logos Connection */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-[#0f172a] shadow-blue-glow flex items-center justify-center overflow-hidden border border-[#1e293b] p-2">
            <SubTrackLogo size={52} />
          </div>
          <div className="flex items-center text-[#64748b]">
            <ArrowLeftRight className="w-5 h-5" />
          </div>
          <div className="w-16 h-16 rounded-2xl bg-[#0f172a] shadow-subtrack flex items-center justify-center border border-[#1e293b] p-3">
            <img
              src={GOOGLE_ICON_URL}
              alt="Google"
              className="w-8 h-8 object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-[#f1f5f9] mb-1.5 leading-snug">
            SubTrack solicita acceso a tu cuenta de Google
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-[#60a5fa]">{email}</p>
        </div>

        {/* Permissions List */}
        <div className="w-full bg-[#0f172a] rounded-2xl border border-[#1e293b] shadow-subtrack p-6 mb-6 flex flex-col gap-4">
          <h2 className="text-sm sm:text-base font-bold text-[#f1f5f9]">Esto permitirá a SubTrack:</h2>

          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-[#131d35] flex items-center justify-center text-[#38bdf8] flex-shrink-0 mt-0.5 border border-[#1e293b]">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-[#f1f5f9] leading-snug">
                Verificar tu dirección de correo electrónico principal.
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-[#1e293b]" />

          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-[#131d35] flex items-center justify-center text-[#38bdf8] flex-shrink-0 mt-0.5 border border-[#1e293b]">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-[#f1f5f9] leading-snug">
                Sincronizar tu perfil y proteger tus preferencias de forma segura.
              </p>
            </div>
          </div>
        </div>

        {/* Terms & Trust */}
        <div className="text-center mb-6 px-2">
          <p className="text-xs text-[#94a3b8] leading-relaxed">
            Asegúrate de que confías en SubTrack. Puedes revocar el acceso en cualquier momento en tu
            cuenta de Google.{' '}
            <span className="text-[#3b82f6] underline cursor-pointer hover:text-[#60a5fa]">
              Más información
            </span>
            .
          </p>
        </div>

        {/* Actions */}
        <div className="w-full flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3.5 px-6 rounded-xl border border-[#334155] text-xs sm:text-sm font-semibold text-[#f1f5f9] hover:bg-[#1e293b] transition-colors active:scale-98 min-h-[48px] touch-manipulation"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onAllow}
            className="flex-1 py-3.5 px-6 rounded-xl bg-[#3b82f6] text-xs sm:text-sm font-bold text-white hover:bg-[#2563eb] transition-all shadow-blue-glow active:scale-98 min-h-[48px] touch-manipulation"
          >
            Permitir
          </button>
        </div>
      </main>
    </div>
  );
};
