import React, { useState } from 'react';
import { Subscription, PaymentHistoryItem, Currency } from '../types';
import { formatCurrency } from '../data/initialData';
import {
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  ShoppingBag,
  Plus,
  Radio,
  CheckCircle2,
  Receipt,
  X,
  ExternalLink,
  Calendar as CalendarIcon,
  CreditCard,
  ArrowLeft,
  CalendarDays,
} from 'lucide-react';
import { EmptyState } from './EmptyState';

interface PaymentsScreenProps {
  isLoading?: boolean;
  subscriptions: Subscription[];
  history: PaymentHistoryItem[];
  currency: Currency;
  onSelectSubscription: (sub: Subscription) => void;
  onAddNew: () => void;
  onRecordPayment?: (sub: Subscription) => void;
  onShowToast?: (text: string, type?: 'success' | 'info' | 'error') => void;
  onBack?: () => void;
}

export const PaymentsScreen: React.FC<PaymentsScreenProps> = ({
  isLoading,
  subscriptions,
  history,
  currency,
  onSelectSubscription,
  onAddNew,
  onRecordPayment,
  onShowToast,
  onBack,
}) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(15);
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(10); // 10 = Nov
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentHistoryItem | null>(null);
  const [historyFilter, setHistoryFilter] = useState<'all' | 'Paid' | 'Pending'>('all');

  const months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  const currentYear = 2026;
  const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonthIndex, 1).getDay(); // 0 is Sunday

  // Generar cuadrícula del calendario
  const daysInGrid: { day: number; isPrev: boolean; hasDot: boolean; dateStr?: string }[] = [];
  const prevMonthDays = new Date(currentYear, currentMonthIndex, 0).getDate();
  
  // Días del mes anterior para rellenar la primera semana
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    daysInGrid.push({ day: prevMonthDays - i, isPrev: true, hasDot: false });
  }

  // Active upcoming subscriptions
  const activeSubs = subscriptions.filter((s) => s.status === 'active');

  // Días del mes actual
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${currentYear}-${String(currentMonthIndex + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    
    // Un día tiene un cobro si alguna suscripción mensual cae en ese día, o si la fecha exacta coincide
    const hasDot = activeSubs.some((sub) => {
      const subDay = parseInt(sub.nextPaymentDate.split('-')[2] || '0', 10);
      return sub.billingCycle === 'monthly' ? subDay === i : sub.nextPaymentDate === dateStr;
    });

    daysInGrid.push({ day: i, isPrev: false, hasDot, dateStr });
  }

  // Rellenar días del próximo mes hasta completar 35 o 42 casillas
  const remainingCells = 35 - daysInGrid.length;
  if (remainingCells > 0) {
    for (let i = 1; i <= remainingCells; i++) {
      daysInGrid.push({ day: i, isPrev: true, hasDot: false });
    }
  } else if (daysInGrid.length > 35) {
    const extraCells = 42 - daysInGrid.length;
    for (let i = 1; i <= extraCells; i++) {
      daysInGrid.push({ day: i, isPrev: true, hasDot: false });
    }
  }

  // Filter subscriptions based on selected calendar day (if selected)
  const displayedUpcoming =
    selectedDay === null
      ? activeSubs
      : activeSubs.filter((sub) => {
          const dayNum = parseInt(sub.nextPaymentDate.split('-')[2] || '0', 10);
          return dayNum === selectedDay;
        });

  const filteredHistory = history.filter((item) => {
    if (historyFilter === 'all') return true;
    return item.status === historyFilter;
  });

  return (
    <main className="max-w-[768px] lg:max-w-[880px] mx-auto px-4 sm:px-6 py-4 pb-28 flex flex-col gap-8">
      {/* Back navigation button */}
      {onBack && (
        <div className="flex items-center justify-between -mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#94a3b8] hover:text-[#3b82f6] transition-colors p-2 rounded-xl hover:bg-[#0f172a] touch-manipulation -ml-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a Overview</span>
          </button>
        </div>
      )}

      {/* Calendar Section */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#f1f5f9] tracking-tight">
              {months[currentMonthIndex]} 2026
            </h2>
            {selectedDay !== null && (
              <button
                onClick={() => setSelectedDay(null)}
                className="text-[11px] font-semibold text-[#3b82f6] bg-[#1e3a8a]/40 px-2 py-0.5 rounded-full hover:bg-[#1e3a8a] transition-colors"
              >
                Ver todos
              </button>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setCurrentMonthIndex((prev) => (prev > 0 ? prev - 1 : 11));
                if (onShowToast) onShowToast(`Cambiado a ${months[currentMonthIndex > 0 ? currentMonthIndex - 1 : 11]}`, 'info');
              }}
              className="p-2 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-[#94a3b8] hover:text-white transition-all active:scale-95 border border-[#1e293b] min-w-[40px] min-h-[40px] flex items-center justify-center touch-manipulation"
              aria-label="Mes anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                setCurrentMonthIndex((prev) => (prev < 11 ? prev + 1 : 0));
                if (onShowToast) onShowToast(`Cambiado a ${months[currentMonthIndex < 11 ? currentMonthIndex + 1 : 0]}`, 'info');
              }}
              className="p-2 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-[#94a3b8] hover:text-white transition-all active:scale-95 border border-[#1e293b] min-w-[40px] min-h-[40px] flex items-center justify-center touch-manipulation"
              aria-label="Mes siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Calendar Box */}
        <div className="bg-[#0f172a] rounded-2xl p-4 sm:p-5 shadow-subtrack border border-[#1e293b]">
          <div className="grid grid-cols-7 text-center text-xs font-bold text-[#64748b] mb-3">
            <div>Dom</div>
            <div>Lun</div>
            <div>Mar</div>
            <div>Mié</div>
            <div>Jue</div>
            <div>Vie</div>
            <div>Sáb</div>
          </div>
          <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-sm">
            {daysInGrid.map((item, idx) => {
              const isSelected = item.day === selectedDay && !item.isPrev;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (!item.isPrev) {
                      setSelectedDay(item.day === selectedDay ? null : item.day);
                    }
                  }}
                  className={`p-2 rounded-xl transition-all relative flex flex-col items-center justify-center min-h-[42px] touch-manipulation active:scale-90 ${
                    item.isPrev
                      ? 'text-[#334155] cursor-default'
                      : isSelected
                      ? 'bg-[#3b82f6] text-white font-bold shadow-blue-glow scale-105'
                      : 'text-[#f1f5f9] hover:bg-[#1e293b] cursor-pointer'
                  }`}
                >
                  <span>{item.day}</span>
                  {item.hasDot && !isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] absolute bottom-1 shadow-xs" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Upcoming Payments */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#f1f5f9] tracking-tight">Próximos Pagos</h2>
            {!isLoading && selectedDay !== null && (
              <p className="text-xs text-[#94a3b8] mt-0.5">
                Filtrando pagos del día {selectedDay} de {months[currentMonthIndex]}
              </p>
            )}
          </div>
          <button
            onClick={onAddNew}
            className="flex items-center gap-1 text-xs font-bold text-[#3b82f6] hover:text-[#60a5fa] transition-colors p-1"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Añadir</span>
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-3.5 relative">
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-[#1e293b] hidden sm:block" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0f172a] p-4 sm:p-5 rounded-2xl shadow-subtrack border border-[#1e293b] relative z-10 animate-pulse">
                <div className="flex items-center gap-3.5 flex-1">
                  <div className="w-12 h-12 rounded-2xl bg-[#1e293b] shrink-0" />
                  <div className="space-y-2 w-full">
                    <div className="h-4 w-32 bg-[#1e293b] rounded" />
                    <div className="h-3 w-40 bg-[#1e293b] rounded" />
                  </div>
                </div>
                <div className="flex justify-between sm:justify-end gap-3 pt-2 sm:pt-0">
                  <div className="space-y-2 text-right">
                    <div className="h-5 w-16 bg-[#1e293b] rounded ml-auto" />
                    <div className="h-3 w-10 bg-[#1e293b] rounded ml-auto" />
                  </div>
                  <div className="w-[72px] h-[38px] bg-[#1e293b] rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : displayedUpcoming.length === 0 ? (
          <EmptyState 
            icon={<CalendarDays className="w-6 h-6" />}
            title={`Sin pagos el día ${selectedDay}`}
            description={`No hay cobros programados para el ${selectedDay} de ${months[currentMonthIndex]}.`}
            actionLabel="Ver todo el mes"
            onAction={() => setSelectedDay(null)}
          />
        ) : (
          <div className="flex flex-col gap-3.5 relative">
            {/* Vertical Timeline Line */}
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-[#1e293b] hidden sm:block" />

            {displayedUpcoming.map((sub) => {
              return (
                <div
                  key={sub.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0f172a] p-4 sm:p-5 rounded-2xl shadow-subtrack border border-[#1e293b] hover:border-[#3b82f6]/50 transition-all duration-200 relative z-10"
                >
                  <div
                    onClick={() => onSelectSubscription(sub)}
                    className="flex items-center gap-3.5 flex-1 min-w-0 cursor-pointer"
                  >
                    {/* Icon Container */}
                    <div
                      style={{ backgroundColor: sub.iconBgColor || '#1e293b' }}
                      className="w-12 h-12 rounded-2xl text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-sm relative"
                    >
                      {sub.logoType === 'spotify' ? (
                        <Radio className="w-6 h-6 text-white" />
                      ) : (
                        <span>{sub.iconLetter || sub.name.charAt(0)}</span>
                      )}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-base text-[#f1f5f9] truncate">
                        {sub.name}
                      </span>
                      <span className="text-xs text-[#94a3b8]">
                        Vence {sub.nextPaymentDate.replace('2026-', '').replace('-', '/')} • {sub.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#1e293b]">
                    <div className="text-left sm:text-right">
                      <span className="text-lg font-bold text-[#f1f5f9]">
                        {formatCurrency(sub.amount, currency)}
                      </span>
                      <p className="text-[11px] text-[#64748b]">
                        {sub.billingCycle === 'monthly' ? 'Mensual' : 'Anual'}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {onRecordPayment && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRecordPayment(sub);
                          }}
                          className="px-3 py-2 bg-[#1e3a8a]/60 hover:bg-[#1e3a8a] text-[#93c5fd] hover:text-white border border-[#3b82f6]/40 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm flex items-center gap-1 touch-manipulation min-h-[38px]"
                          title="Registrar Pago Ahora"
                        >
                          <CheckCircle2 className="w-4 h-4 text-[#38bdf8]" />
                          <span className="hidden xs:inline">Pagar</span>
                        </button>
                      )}

                      <button
                        onClick={() => onSelectSubscription(sub)}
                        className="px-3 py-2 bg-[#1e293b] hover:bg-[#334155] text-xs font-semibold text-[#f1f5f9] rounded-xl transition-all active:scale-95 min-h-[38px] touch-manipulation"
                      >
                        Detalle
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Payment History Section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#f1f5f9] tracking-tight">Historial de Pagos</h2>
          <div className="flex gap-1 bg-[#0f172a] p-1 rounded-xl border border-[#1e293b]">
            <button
              onClick={() => setHistoryFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                historyFilter === 'all' ? 'bg-[#3b82f6] text-white' : 'text-[#64748b]'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setHistoryFilter('Paid')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                historyFilter === 'Paid' ? 'bg-[#3b82f6] text-white' : 'text-[#64748b]'
              }`}
            >
              Pagados
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="bg-[#0f172a] rounded-2xl p-4 shadow-subtrack border border-[#1e293b] divide-y divide-[#1e293b]">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0 animate-pulse">
                <div className="flex items-center gap-3 w-full">
                  <div className="w-10 h-10 rounded-xl bg-[#1e293b] shrink-0" />
                  <div className="flex flex-col gap-2 w-full max-w-[120px]">
                    <div className="h-3 w-full bg-[#1e293b] rounded" />
                    <div className="h-2.5 w-16 bg-[#1e293b] rounded" />
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="h-4 w-12 bg-[#1e293b] rounded" />
                  <div className="w-16 h-5 bg-[#1e293b] rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredHistory.length === 0 ? (
          <EmptyState 
            icon={<Receipt className="w-6 h-6" />}
            title="Historial vacío"
            description={historyFilter === 'all' ? "Aún no has registrado ningún pago de tus suscripciones." : `No hay pagos con estado "${historyFilter}".`}
          />
        ) : (
          <div className="bg-[#0f172a] rounded-2xl p-4 shadow-subtrack border border-[#1e293b] divide-y divide-[#1e293b]">
            {filteredHistory.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedReceipt(item)}
                className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0 cursor-pointer hover:bg-[#131d35] -mx-4 px-4 rounded-xl transition-colors active:scale-[0.99] touch-manipulation"
                title="Haz clic para ver recibo"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1e293b] flex items-center justify-center text-[#60a5fa] shrink-0 border border-[#334155]">
                    {item.iconType === 'gym' ? (
                      <Dumbbell className="w-5 h-5 text-[#38bdf8]" />
                    ) : item.iconType === 'amazon' ? (
                      <ShoppingBag className="w-5 h-5 text-[#60a5fa]" />
                    ) : (
                      <span className="font-bold text-sm text-[#3b82f6]">{item.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-[#f1f5f9] truncate">{item.name}</span>
                    <span className="text-xs text-[#64748b]">{item.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-bold text-[#f1f5f9]">
                    -{formatCurrency(item.amount, currency)}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#14291e] text-[#4ade80] text-[11px] font-bold border border-[#4ade80]/30 flex items-center gap-1">
                    <Receipt className="w-3 h-3" />
                    <span>{item.status}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Payment Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-[#0f172a] rounded-2xl p-6 max-w-sm w-full shadow-subtrack-lg border border-[#1e293b]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1e293b]">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#3b82f6]" />
                <h3 className="text-base font-bold text-[#f1f5f9]">Comprobante de Pago</h3>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="p-1 rounded-full text-[#94a3b8] hover:bg-[#1e293b]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="bg-[#131d35] p-3 rounded-xl flex items-center justify-between border border-[#1e293b]">
                <span className="text-[#94a3b8]">Servicio</span>
                <span className="font-bold text-white text-sm">{selectedReceipt.name}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-[#1e293b]">
                <span className="text-[#64748b]">Monto Pagado</span>
                <span className="font-bold text-[#4ade80] text-sm">
                  {formatCurrency(selectedReceipt.amount, currency)}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-[#1e293b]">
                <span className="text-[#64748b]">Fecha de Transacción</span>
                <span className="font-medium text-[#f1f5f9]">
                  {selectedReceipt.fullDate || '2026-11-01'}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-[#1e293b]">
                <span className="text-[#64748b]">Estado</span>
                <span className="font-bold text-[#4ade80] bg-[#14291e] px-2 py-0.5 rounded-full border border-[#4ade80]/30">
                  {selectedReceipt.status}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-[#1e293b]">
                <span className="text-[#64748b]">ID de Recibo</span>
                <span className="font-mono text-[#94a3b8]">{selectedReceipt.id}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedReceipt(null)}
              className="w-full mt-5 py-2.5 rounded-xl bg-[#3b82f6] hover:bg-[#2563eb] text-white text-xs font-bold shadow-blue-glow transition-all active:scale-95"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

