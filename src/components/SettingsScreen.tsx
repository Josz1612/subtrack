import React, { useState, useRef } from 'react';
import { UserProfile, Subscription, Currency } from '../types';
import { formatCurrency } from '../data/initialData';
import { SubTrackLogo } from './SubTrackLogo';
import {
  CreditCard,
  Target,
  Bell,
  FileText,
  Lock,
  Fingerprint,
  Download,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight,
  Check,
  Shield,
  Smartphone,
  ArrowLeft,
  Camera,
} from 'lucide-react';

interface SettingsScreenProps {
  user: UserProfile;
  subscriptions: Subscription[];
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onLogout: () => void;
  onShowToast?: (text: string, type?: 'success' | 'info' | 'error') => void;
  onImportSubscriptions?: (subs: Subscription[]) => void;
  onBack?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  user,
  subscriptions,
  onUpdateUser,
  onLogout,
  onShowToast,
  onImportSubscriptions,
  onBack,
}) => {
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState<string | null>(null);

  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);
  const [exportMessage, setExportMessage] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const importFileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      onUpdateUser({ avatarUrl: url });
      if (onShowToast) {
        onShowToast('Foto de perfil actualizada', 'success');
      }
    }
  };

  const handleExportData = () => {
    // Solo exportar el array de suscripciones según requerimiento
    const dataStr = JSON.stringify(subscriptions, null, 2);
    const blob = new Blob([dataStr], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subtrack-backup.json`;
    a.click();
    URL.revokeObjectURL(url);
    if (onShowToast) {
      onShowToast('¡Datos exportados con éxito en formato JSON!');
    } else {
      setExportMessage('¡Datos exportados con éxito en formato JSON!');
      setTimeout(() => setExportMessage(''), 3500);
    }
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        const data = JSON.parse(json);
        
        if (Array.isArray(data)) {
          if (onImportSubscriptions) {
            onImportSubscriptions(data);
          }
        } else {
          throw new Error("Formato de JSON inválido");
        }
      } catch (error) {
        if (onShowToast) {
          onShowToast('Error al importar el archivo JSON', 'error');
        }
        console.error("Error importando JSON:", error);
      }
    };
    reader.readAsText(file);
    // Resetear el input para permitir volver a subir el mismo archivo
    e.target.value = '';
  };

  return (
    <main className="max-w-[768px] lg:max-w-[880px] mx-auto px-4 sm:px-6 py-4 pb-28 flex flex-col gap-6">
      {/* Back navigation button */}
      {onBack && (
        <div className="flex items-center justify-between -mb-2">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#94a3b8] hover:text-[#3b82f6] transition-colors p-2 rounded-xl hover:bg-[#0f172a] touch-manipulation -ml-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a Overview</span>
          </button>
        </div>
      )}

      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#f1f5f9] tracking-tight">
          Configuración
        </h1>
        <p className="text-xs sm:text-sm text-[#94a3b8] mt-1">
          Gestiona tu perfil, preferencias de moneda, alertas y seguridad
        </p>
      </div>

      {exportMessage && (
        <div className="p-3.5 bg-[#14291e] border border-[#4ade80]/40 text-[#4ade80] text-xs font-semibold rounded-xl text-center shadow-sm">
          {exportMessage}
        </div>
      )}

      {/* 1. Profile Section */}
      <section>
        <div className="bg-[#0f172a] rounded-2xl p-5 sm:p-6 border border-[#1e293b] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-subtrack">
          <div className="flex items-center gap-4">
            <div 
              onClick={handleAvatarClick}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border border-[#334155] flex-shrink-0 bg-[#1e293b] relative group cursor-pointer"
            >
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
              />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-[#f1f5f9] truncate">
                {user.name}
              </h2>
              <p className="text-xs sm:text-sm text-[#94a3b8] truncate">{user.email}</p>
              <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-[#1e3a8a]/40 text-[#60a5fa] text-[10px] font-bold border border-[#3b82f6]/30">
                <Shield className="w-2.5 h-2.5" />
                <span>Cuenta Protegida</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowEditProfileModal(true)}
            className="bg-[#3b82f6] hover:bg-[#2563eb] text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-blue-glow active:scale-95 transition-all min-h-[44px] touch-manipulation flex items-center justify-center self-start sm:self-auto"
          >
            Editar Perfil
          </button>
        </div>
      </section>

      {/* 2. Preferences Section */}
      <section className="space-y-3">
        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#94a3b8]">
          Preferencias de Moneda y Presupuesto
        </h3>
        <div className="bg-[#0f172a] rounded-2xl border border-[#1e293b] shadow-subtrack overflow-hidden divide-y divide-[#1e293b]">
          <div className="p-4 sm:p-5 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#131d35] flex items-center justify-center text-[#38bdf8] border border-[#1e293b]">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-[#f1f5f9]">Moneda Principal</p>
                <p className="text-xs text-[#94a3b8]">{user.preferredCurrency} ($)</p>
              </div>
            </div>
            <button
              onClick={() => setShowCurrencyModal(true)}
              className="text-xs sm:text-sm font-bold text-[#3b82f6] hover:text-[#60a5fa] px-3 py-1.5 rounded-lg hover:bg-[#131d35] transition-colors touch-manipulation min-h-[40px] flex items-center"
            >
              Cambiar
            </button>
          </div>

          <div className="p-4 sm:p-5 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#131d35] flex items-center justify-center text-[#38bdf8] border border-[#1e293b]">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-[#f1f5f9]">Límite de Presupuesto</p>
                <p className="text-xs text-[#94a3b8]">
                  {formatCurrency(user.monthlyBudgetGoal, user.preferredCurrency)} mensual
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer min-h-[44px] min-w-[44px] justify-center">
              <input
                type="checkbox"
                checked={user.budgetGoalEnabled}
                onChange={(e) => onUpdateUser({ budgetGoalEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#1e293b] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[12px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3b82f6]" />
            </label>
          </div>
        </div>
      </section>

      {/* 3. Notifications */}
      <section className="space-y-3">
        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#94a3b8]">
          Notificaciones y Avisos
        </h3>
        <div className="bg-[#0f172a] rounded-2xl border border-[#1e293b] shadow-subtrack overflow-hidden divide-y divide-[#1e293b]">
          <div className="p-4 sm:p-5 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#131d35] flex items-center justify-center text-[#38bdf8] border border-[#1e293b]">
                <Bell className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-[#f1f5f9]">
                Aviso de pago: 1 día antes
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer min-h-[44px] min-w-[44px] justify-center">
              <input
                type="checkbox"
                checked={user.notification1Day}
                onChange={(e) => onUpdateUser({ notification1Day: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#1e293b] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[12px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3b82f6]" />
            </label>
          </div>

          <div className="p-4 sm:p-5 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#131d35] flex items-center justify-center text-[#38bdf8] border border-[#1e293b]">
                <Bell className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-[#f1f5f9]">
                Aviso preventivo: 3 días antes
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer min-h-[44px] min-w-[44px] justify-center">
              <input
                type="checkbox"
                checked={user.notification3Days}
                onChange={(e) => onUpdateUser({ notification3Days: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#1e293b] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[12px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3b82f6]" />
            </label>
          </div>

          <div className="p-4 sm:p-5 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#131d35] flex items-center justify-center text-[#38bdf8] border border-[#1e293b]">
                <FileText className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-[#f1f5f9]">
                Resumen financiero mensual
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer min-h-[44px] min-w-[44px] justify-center">
              <input
                type="checkbox"
                checked={user.monthlyReport}
                onChange={(e) => onUpdateUser({ monthlyReport: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#1e293b] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[12px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3b82f6]" />
            </label>
          </div>
        </div>
      </section>

      {/* 4. Security & Account */}
      <section className="space-y-3">
        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#94a3b8]">
          Seguridad y Datos
        </h3>
        <div className="bg-[#0f172a] rounded-2xl border border-[#1e293b] shadow-subtrack overflow-hidden divide-y divide-[#1e293b]">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="w-full p-4 sm:p-5 flex items-center justify-between hover:bg-[#131d35] transition-colors text-left touch-manipulation min-h-[52px]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#131d35] flex items-center justify-center text-[#38bdf8] border border-[#1e293b]">
                <Lock className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-[#f1f5f9]">
                Cambiar Contraseña
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-[#64748b]" />
          </button>

          <div className="p-4 sm:p-5 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#131d35] flex items-center justify-center text-[#38bdf8] border border-[#1e293b]">
                <Fingerprint className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-[#f1f5f9]">
                  Acceso Biométrico (Face ID / Huella)
                </p>
                <p className="text-[11px] text-[#94a3b8]">Compatible con iOS y Android</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer min-h-[44px] min-w-[44px] justify-center">
              <input
                type="checkbox"
                checked={user.biometricLogin}
                onChange={(e) => onUpdateUser({ biometricLogin: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#1e293b] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[12px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3b82f6]" />
            </label>
          </div>

          <button
            onClick={handleExportData}
            className="w-full p-4 sm:p-5 flex items-center justify-between hover:bg-[#131d35] transition-colors text-left touch-manipulation min-h-[52px]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#131d35] flex items-center justify-center text-[#38bdf8] border border-[#1e293b]">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-[#f1f5f9]">
                  Exportar Datos (Copia de Seguridad JSON)
                </p>
                <p className="text-[11px] text-[#94a3b8]">Descarga tus datos locales</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#64748b]" />
          </button>

          <button
            onClick={() => importFileInputRef.current?.click()}
            className="w-full p-4 sm:p-5 flex items-center justify-between hover:bg-[#131d35] transition-colors text-left touch-manipulation min-h-[52px]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#131d35] flex items-center justify-center text-[#38bdf8] border border-[#1e293b]">
                <Download className="w-5 h-5 rotate-180" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-[#f1f5f9]">
                  Importar Datos (JSON)
                </p>
                <p className="text-[11px] text-[#94a3b8]">Restaura desde un archivo</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#64748b]" />
          </button>
          
          <input
            type="file"
            accept="application/json"
            ref={importFileInputRef}
            onChange={handleImportData}
            className="hidden"
          />
        </div>
      </section>

      {/* 5. Support & About */}
      <section className="space-y-3">
        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#94a3b8]">
          Soporte e Información
        </h3>
        <div className="bg-[#0f172a] rounded-2xl border border-[#1e293b] shadow-subtrack overflow-hidden divide-y divide-[#1e293b]">
          <button
            onClick={() =>
              setShowInfoModal(
                'Centro de Ayuda: Puedes añadir, pausar, editar o cancelar cualquier suscripción con recordatorios automáticos 1 a 3 días antes del cobro.'
              )
            }
            className="w-full p-4 sm:p-5 flex items-center justify-between hover:bg-[#131d35] transition-colors text-left touch-manipulation min-h-[52px]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#131d35] flex items-center justify-center text-[#38bdf8] border border-[#1e293b]">
                <HelpCircle className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-[#f1f5f9]">Centro de Ayuda</p>
            </div>
            <ChevronRight className="w-5 h-5 text-[#64748b]" />
          </button>

          <button
            onClick={() =>
              setShowInfoModal(
                'Términos del Servicio: SubTrack protege la privacidad de tus finanzas. Tus datos de suscripción se mantienen de forma segura en tu dispositivo.'
              )
            }
            className="w-full p-4 sm:p-5 flex items-center justify-between hover:bg-[#131d35] transition-colors text-left touch-manipulation min-h-[52px]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#131d35] flex items-center justify-center text-[#38bdf8] border border-[#1e293b]">
                <FileText className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-[#f1f5f9]">
                Términos del Servicio y Privacidad
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-[#64748b]" />
          </button>

          <div className="p-4 sm:p-5 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#131d35] flex items-center justify-center text-[#38bdf8] border border-[#1e293b]">
                <Smartphone className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-[#f1f5f9]">Versión de la App</p>
            </div>
            <span className="text-xs font-bold text-[#60a5fa] px-2.5 py-1 bg-[#131d35] rounded-lg border border-[#1e293b]">
              v2.1.0 (iOS/Android)
            </span>
          </div>
        </div>
      </section>

      {/* 6. Brand Badge & Log Out */}
      <section className="flex flex-col items-center gap-4 pt-2 pb-4">
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#0f172a] border border-[#1e293b] w-full max-w-sm text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#131d35] p-1 border border-[#1e293b] flex items-center justify-center shadow-blue-glow mb-2 overflow-hidden">
            <SubTrackLogo size={44} />
          </div>
          <p className="text-sm font-bold text-[#f1f5f9] tracking-tight">SubTrack</p>
          <p className="text-[11px] text-[#64748b]">Tu gestor financiero de suscripciones</p>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#ef4444] hover:bg-[#ef4444]/10 px-6 py-3 rounded-xl active:scale-95 transition-all min-h-[48px] touch-manipulation"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar Sesión</span>
        </button>
      </section>

      {/* Currency Modal */}
      {showCurrencyModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0f172a] rounded-2xl p-6 max-w-sm w-full shadow-subtrack-lg border border-[#1e293b] animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-[#f1f5f9] mb-4">Seleccionar Moneda</h3>
            <div className="space-y-2">
              {(['USD', 'EUR', 'MXN', 'GBP'] as Currency[]).map((curr) => (
                <button
                  key={curr}
                  onClick={() => {
                    onUpdateUser({ preferredCurrency: curr });
                    setShowCurrencyModal(false);
                  }}
                  className={`w-full p-3 rounded-xl text-left text-xs font-bold flex items-center justify-between transition-colors touch-manipulation min-h-[44px] ${
                    user.preferredCurrency === curr
                      ? 'bg-[#3b82f6] text-white shadow-sm'
                      : 'bg-[#131d35] text-[#f1f5f9] hover:bg-[#1e293b]'
                  }`}
                >
                  <span>{curr}</span>
                  {user.preferredCurrency === curr && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0f172a] rounded-2xl p-6 max-w-sm w-full shadow-subtrack-lg border border-[#1e293b] animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-[#f1f5f9] mb-4">Editar Perfil</h3>
            <div className="space-y-3 mb-5">
              <div>
                <label className="block text-xs font-medium text-[#94a3b8] mb-1">Nombre</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#131d35] border border-[#1e293b] rounded-xl py-2.5 px-3 text-xs sm:text-sm text-[#f1f5f9] focus:outline-none focus:border-[#3b82f6]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#94a3b8] mb-1">Email</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full bg-[#131d35] border border-[#1e293b] rounded-xl py-2.5 px-3 text-xs sm:text-sm text-[#f1f5f9] focus:outline-none focus:border-[#3b82f6]"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowEditProfileModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#334155] text-xs font-semibold text-[#f1f5f9] hover:bg-[#1e293b] min-h-[44px]"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onUpdateUser({ name: editName, email: editEmail });
                  setShowEditProfileModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#3b82f6] hover:bg-[#2563eb] text-white text-xs font-bold shadow-blue-glow min-h-[44px]"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0f172a] rounded-2xl p-6 max-w-sm w-full shadow-subtrack-lg border border-[#1e293b] animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-[#f1f5f9] mb-3">Cambiar Contraseña</h3>
            <div className="space-y-3 mb-5">
              <input
                type="password"
                placeholder="Contraseña actual"
                className="w-full bg-[#131d35] border border-[#1e293b] rounded-xl py-2.5 px-3 text-xs sm:text-sm text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:border-[#3b82f6]"
              />
              <input
                type="password"
                placeholder="Nueva contraseña"
                className="w-full bg-[#131d35] border border-[#1e293b] rounded-xl py-2.5 px-3 text-xs sm:text-sm text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:border-[#3b82f6]"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#334155] text-xs font-semibold text-[#f1f5f9] hover:bg-[#1e293b] min-h-[44px]"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setExportMessage('¡Contraseña actualizada con éxito!');
                  setTimeout(() => setExportMessage(''), 3000);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#3b82f6] hover:bg-[#2563eb] text-white text-xs font-bold shadow-blue-glow min-h-[44px]"
              >
                Actualizar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info / About Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0f172a] rounded-2xl p-6 max-w-sm w-full shadow-subtrack-lg border border-[#1e293b] animate-in fade-in zoom-in-95 duration-150">
            <p className="text-xs sm:text-sm text-[#f1f5f9] leading-relaxed mb-5">
              {showInfoModal}
            </p>
            <button
              onClick={() => setShowInfoModal(null)}
              className="w-full py-2.5 rounded-xl bg-[#3b82f6] hover:bg-[#2563eb] text-white text-xs font-bold shadow-blue-glow min-h-[44px]"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

