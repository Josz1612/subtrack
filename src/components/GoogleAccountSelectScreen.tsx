import React from 'react';
import { ALEX_AVATAR_URL, WORK_AVATAR_URL } from '../data/initialData';
import { SubTrackLogo } from './SubTrackLogo';
import { UserCircle2, ArrowLeft } from 'lucide-react';

interface GoogleAccountSelectScreenProps {
  onSelectAccount: (account: { name: string; email: string; avatarUrl: string }) => void;
  onBack: () => void;
}

export const GoogleAccountSelectScreen: React.FC<GoogleAccountSelectScreenProps> = ({
  onSelectAccount,
  onBack,
}) => {
  return (
    <div className="min-h-screen bg-[#070b14] flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-[440px] mx-auto flex flex-col items-center">
        {/* Back Button */}
        <div className="w-full flex justify-start mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#94a3b8] hover:text-[#3b82f6] transition-colors p-2 min-h-[40px] touch-manipulation"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver</span>
          </button>
        </div>

        {/* Header with SubTrack Logo */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-2xl bg-[#131d35] border border-[#1e293b] p-2 shadow-blue-glow flex items-center justify-center mb-4">
            <SubTrackLogo size={64} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#f1f5f9] tracking-tight mb-1">
            Selecciona una cuenta
          </h1>
          <p className="text-xs sm:text-sm text-[#94a3b8]">Para continuar en SubTrack</p>
        </div>

        {/* Account Cards */}
        <div className="w-full bg-[#0f172a] rounded-2xl shadow-subtrack border border-[#1e293b] overflow-hidden divide-y divide-[#1e293b]">
          {/* Alex Smith */}
          <button
            onClick={() =>
              onSelectAccount({
                name: 'Alex Smith',
                email: 'alex.smith@gmail.com',
                avatarUrl: ALEX_AVATAR_URL,
              })
            }
            className="w-full flex items-center p-4 hover:bg-[#131d35] transition-colors text-left group active:scale-[0.99] touch-manipulation min-h-[64px]"
          >
            <div className="w-12 h-12 rounded-xl overflow-hidden mr-4 border border-[#334155] flex-shrink-0 bg-[#1e293b]">
              <img
                src={ALEX_AVATAR_URL}
                alt="Alex Smith"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1 overflow-hidden">
              <h3 className="text-sm sm:text-base font-bold text-[#f1f5f9] group-hover:text-[#3b82f6] transition-colors">
                Alex Smith
              </h3>
              <p className="text-xs text-[#94a3b8] truncate">alex.smith@gmail.com</p>
            </div>
          </button>

          {/* Work Account */}
          <button
            onClick={() =>
              onSelectAccount({
                name: 'Alex Smith (Work)',
                email: 'alex.s@company.com',
                avatarUrl: WORK_AVATAR_URL,
              })
            }
            className="w-full flex items-center p-4 hover:bg-[#131d35] transition-colors text-left group active:scale-[0.99] touch-manipulation min-h-[64px]"
          >
            <div className="w-12 h-12 rounded-xl overflow-hidden mr-4 border border-[#334155] flex-shrink-0 bg-[#1e293b]">
              <img
                src={WORK_AVATAR_URL}
                alt="Work Account"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1 overflow-hidden">
              <h3 className="text-sm sm:text-base font-bold text-[#f1f5f9] group-hover:text-[#3b82f6] transition-colors">
                Work Account
              </h3>
              <p className="text-xs text-[#94a3b8] truncate">alex.s@company.com</p>
            </div>
          </button>

          {/* Use another account */}
          <button
            onClick={() =>
              onSelectAccount({
                name: 'Nuevo Usuario',
                email: 'usuario@gmail.com',
                avatarUrl: ALEX_AVATAR_URL,
              })
            }
            className="w-full flex items-center p-4 hover:bg-[#131d35] transition-colors text-left group active:scale-[0.99] touch-manipulation min-h-[64px]"
          >
            <div className="w-12 h-12 rounded-xl bg-[#131d35] flex items-center justify-center mr-4 flex-shrink-0 text-[#64748b] group-hover:text-[#3b82f6] transition-colors border border-[#1e293b]">
              <UserCircle2 className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-[#f1f5f9] group-hover:text-[#3b82f6] transition-colors">
                Usar otra cuenta
              </h3>
            </div>
          </button>
        </div>

        {/* Footer Notice */}
        <div className="mt-8 text-xs text-[#64748b] text-center max-w-[85%] leading-relaxed">
          Al continuar, Google compartirá tu nombre, dirección de correo electrónico, preferencia de
          idioma y foto de perfil con SubTrack.
        </div>
      </div>
    </div>
  );
};
