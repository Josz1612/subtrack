import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ScreenId, UserProfile } from '../types';
import { SubTrackLogo } from './SubTrackLogo';
import {
  ArrowLeft,
  Menu,
  MoreVertical,
  Plus,
  Layers,
  Sparkles,
  PieChart,
  Calendar,
  Settings as SettingsIcon,
  CreditCard,
  X,
  Share2,
} from 'lucide-react';

interface HeaderProps {
  user: UserProfile;
  title?: string;
  onAddNew?: () => void;
  onShowToast?: (text: string, type?: 'success' | 'info' | 'error') => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  title = 'SubTrack',
  onAddNew,
  onShowToast,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentScreen = (location.pathname.substring(1) || 'payments') as ScreenId;
  const [showScreenPicker, setShowScreenPicker] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  const isDetailOrSubScreen = currentScreen === 'detail' || currentScreen === 'new_subscription';
  const isAuthScreen =
    currentScreen === 'register' ||
    currentScreen === 'google_select' ||
    currentScreen === 'google_consent' ||
    currentScreen === 'onboarding';

  const screens: { id: ScreenId; label: string; icon: string }[] = [
    { id: 'register', label: '1. Crea tu cuenta (Sign Up)', icon: '📝' },
    { id: 'google_select', label: '2. Selecciona cuenta Google', icon: '🔍' },
    { id: 'google_consent', label: '3. Permisos de Google', icon: '🛡️' },
    { id: 'onboarding', label: '4. Bienvenida / Setup (Paso 1)', icon: '🚀' },
    { id: 'payments', label: '5. Pagos & Calendario (Main)', icon: '📅' },
    { id: 'overview', label: '6. Resumen General (Overview)', icon: '📊' },
    { id: 'insights', label: '7. Insights & Tendencias', icon: '📈' },
    { id: 'detail', label: '8. Detalle Suscripción', icon: '🔍' },
    { id: 'new_subscription', label: '9. Nueva Suscripción (Form)', icon: '➕' },
    { id: 'settings', label: '10. Ajustes & Preferencias', icon: '⚙️' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#070b14]/90 backdrop-blur-md border-b border-[#1e293b] pt-safe">
      <div className="max-w-[768px] lg:max-w-[880px] mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left Action / Back */}
        <div className="flex items-center gap-2.5">
          {isDetailOrSubScreen ? (
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-full text-[#94a3b8] hover:bg-[#1e293b] hover:text-white active:scale-95 transition-all touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Volver"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : !isAuthScreen ? (
            <button
              onClick={() => setShowQuickMenu(true)}
              className="p-2 -ml-2 rounded-full text-[#3b82f6] hover:bg-[#1e293b] active:scale-95 transition-all touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Menú rápido"
            >
              <Menu className="w-5 h-5 text-[#3b82f6]" />
            </button>
          ) : (
            <div className="w-6" />
          )}

          <div
            onClick={() => !isAuthScreen && navigate('/payments')}
            className={`font-bold text-xl md:text-2xl text-[#3b82f6] tracking-tight flex items-center gap-2.5 ${
              !isAuthScreen ? 'cursor-pointer hover:opacity-90 active:scale-98 transition-transform' : ''
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-[#0f172a] border border-[#1e293b] p-0.5 flex items-center justify-center shadow-blue-glow overflow-hidden">
              <SubTrackLogo size={28} />
            </div>
            <span>{title}</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Screen Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowScreenPicker(!showScreenPicker)}
              title="Explorar todas las vistas del diseño"
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#0f172a] hover:bg-[#1e293b] text-[#60a5fa] border border-[#1e293b] transition-all active:scale-95 shadow-sm min-h-[38px] touch-manipulation"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Vistas</span>
            </button>

            {showScreenPicker && (
              <>
                <div
                  className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs"
                  onClick={() => setShowScreenPicker(false)}
                />
                <div className="absolute right-0 mt-2 w-72 bg-[#0f172a] rounded-2xl shadow-subtrack-lg border border-[#1e293b] p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#94a3b8] border-b border-[#1e293b] flex items-center justify-between">
                    <span>Pantallas del Diseño</span>
                    <span className="text-[#3b82f6] text-[10px]">10 vistas</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto py-1 space-y-1">
                    {screens.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          navigate(`/${s.id}`);
                          setShowScreenPicker(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-xs flex items-center gap-2.5 transition-colors ${
                          currentScreen === s.id
                            ? 'bg-[#3b82f6] text-white font-bold shadow-sm'
                            : 'text-[#f1f5f9] hover:bg-[#1e293b]'
                        }`}
                      >
                        <span className="text-sm">{s.icon}</span>
                        <span className="truncate">{s.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {!isAuthScreen && (
            <>
              {onAddNew && (
                <button
                  onClick={onAddNew}
                  className="p-2 rounded-xl bg-[#3b82f6] hover:bg-[#2563eb] text-white shadow-blue-glow transition-all active:scale-95 min-w-[40px] min-h-[40px] flex items-center justify-center touch-manipulation"
                  title="Nueva Suscripción"
                  aria-label="Añadir nueva suscripción"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                </button>
              )}

              <button
                onClick={() => navigate('/settings')}
                className="w-9 h-9 rounded-xl overflow-hidden border border-[#334155] hover:border-[#3b82f6] transition-all active:scale-95 shadow-sm min-w-[36px] min-h-[36px] touch-manipulation"
                title="Perfil y Ajustes"
                aria-label="Perfil de usuario"
              >
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </button>
            </>
          )}

          {isDetailOrSubScreen && (
            <button
              onClick={() => {
                if (onShowToast) {
                  onShowToast('Acciones de suscripción disponibles abajo', 'info');
                }
              }}
              className="p-2 rounded-full text-[#94a3b8] hover:bg-[#1e293b] hover:text-white transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
              title="Más opciones"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </header>

      {/* Quick Drawer / Modal Navigation Menu */}
      {showQuickMenu && (
        <div className="fixed inset-0 z-[999] flex items-start justify-start">
          {/* Overlay oscuro semitransparente que cierra el menú al hacer clic */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150" 
            onClick={() => setShowQuickMenu(false)} 
          />
          {/* Menú lateral con animación de deslizamiento desde la izquierda */}
          <div className="relative z-10 bg-[#0f172a] w-4/5 max-w-xs h-full p-5 border-r border-[#1e293b] shadow-subtrack-lg flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-200">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#1e293b] mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#0f172a] p-0.5 border border-[#1e293b] flex items-center justify-center shadow-sm overflow-hidden">
                    <SubTrackLogo size={28} />
                  </div>
                  <span className="font-bold text-lg text-[#3b82f6]">SubTrack</span>
                </div>
                <button
                  onClick={() => setShowQuickMenu(false)}
                  className="p-1.5 rounded-full hover:bg-[#1e293b] text-[#94a3b8]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex flex-col gap-6 p-6 mt-8">
                <button 
                  onClick={() => {
                    navigate('/overview');
                    setShowQuickMenu(false);
                  }} 
                  className="text-left text-lg font-semibold hover:text-blue-400"
                >
                  Overview
                </button>
                <button 
                  onClick={() => {
                    navigate('/payments');
                    setShowQuickMenu(false);
                  }} 
                  className="text-left text-lg font-semibold hover:text-blue-400"
                >
                  Payments
                </button>
                <button 
                  onClick={() => {
                    navigate('/insights');
                    setShowQuickMenu(false);
                  }} 
                  className="text-left text-lg font-semibold hover:text-blue-400"
                >
                  Insights
                </button>
                <button 
                  onClick={() => {
                    navigate('/settings');
                    setShowQuickMenu(false);
                  }} 
                  className="text-left text-lg font-semibold hover:text-blue-400"
                >
                  Settings
                </button>
              </nav>
            </div>

            <div className="pt-4 border-t border-[#1e293b]">
              <p className="text-[11px] text-[#64748b] text-center">
                SubTrack v1.0.2 • Blue Edition
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

