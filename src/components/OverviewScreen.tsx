import React, { useState } from 'react';
import { Subscription, Currency, ScreenId } from '../types';
import { formatCurrency } from '../data/initialData';
import {
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  ArrowUpRight,
  Sliders,
  TrendingUp,
  X,
  Check,
  Edit,
  Trash2,
  MoreVertical,
} from 'lucide-react';
import { EmptyState } from './EmptyState';

interface OverviewScreenProps {
  isLoading?: boolean;
  subscriptions: Subscription[];
  currency: Currency;
  monthlyBudgetGoal: number;
  onSelectSubscription: (sub: Subscription) => void;
  onAddNew: () => void;
  onUpdateBudget?: (newGoal: number) => void;
  onNavigate?: (screen: ScreenId) => void;
  onEditSubscription?: (sub: Subscription) => void;
  onDeleteSubscription?: (subId: string) => void;
}

export const OverviewScreen: React.FC<OverviewScreenProps> = ({
  isLoading,
  subscriptions,
  currency,
  monthlyBudgetGoal,
  onSelectSubscription,
  onAddNew,
  onUpdateBudget,
  onNavigate,
  onEditSubscription,
  onDeleteSubscription,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'paused'>('all');
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [tempBudget, setTempBudget] = useState<string>(monthlyBudgetGoal.toString());

  const activeSubs = subscriptions.filter((s) => s.status === 'active');
  const pausedSubs = subscriptions.filter((s) => s.status === 'paused');
  const totalMonthlySpend = activeSubs.reduce((acc, curr) => acc + curr.amount, 0);
  const budgetPercentage = Math.min(
    Math.round((totalMonthlySpend / (monthlyBudgetGoal || 150)) * 100),
    100
  );

  const categories = ['All', 'Entertainment', 'Productivity', 'Utilities', 'Health', 'Developer'];

  const filteredSubs = subscriptions.filter((s) => {
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && s.status === 'active') ||
      (statusFilter === 'paused' && s.status === 'paused');
    return matchesCategory && matchesSearch && matchesStatus;
  });

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(tempBudget);
    if (parsed > 0 && onUpdateBudget) {
      onUpdateBudget(parsed);
    }
    setShowBudgetModal(false);
  };

  return (
    <main className="max-w-[768px] lg:max-w-[880px] mx-auto px-4 sm:px-6 py-4 pb-28 flex flex-col gap-6">
      {/* Hero Summary Card */}
      <section className="bg-[#0f172a] rounded-[24px] p-6 sm:p-7 shadow-subtrack-lg border border-[#1e293b] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#3b82f6]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex justify-between items-start mb-4 relative z-10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
              Gasto Mensual Activo
            </span>
            <div className="text-3xl sm:text-4xl font-bold text-[#3b82f6] tracking-tight mt-1">
              {formatCurrency(totalMonthlySpend, currency)}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBudgetModal(true)}
              className="p-2 rounded-xl bg-[#1e293b] hover:bg-[#334155] text-[#94a3b8] hover:text-[#38bdf8] transition-all active:scale-95 touch-manipulation"
              title="Ajustar Meta de Presupuesto"
              aria-label="Ajustar presupuesto"
            >
              <Sliders className="w-4 h-4" />
            </button>
            <button
              onClick={onAddNew}
              className="flex items-center gap-1.5 bg-[#3b82f6] hover:bg-[#2563eb] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-blue-glow transition-all active:scale-95 touch-manipulation min-h-[40px]"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Añadir</span>
            </button>
          </div>
        </div>

        {/* Budget Progress Bar with interactive click */}
        <div
          onClick={() => setShowBudgetModal(true)}
          className="space-y-2 relative z-10 pt-2 border-t border-[#1e293b] cursor-pointer group"
          title="Haz clic para ajustar la meta"
        >
          <div className="flex justify-between text-xs text-[#94a3b8]">
            <span className="font-medium flex items-center gap-1">
              Presupuesto: {formatCurrency(totalMonthlySpend, currency)} de{' '}
              <span className="text-white font-bold underline decoration-[#3b82f6]/50">
                {formatCurrency(monthlyBudgetGoal, currency)}
              </span>
            </span>
            <span
              className={`font-bold ${budgetPercentage > 90 ? 'text-[#f87171]' : 'text-[#60a5fa]'}`}
            >
              {budgetPercentage}%
            </span>
          </div>
          <div className="w-full h-3 bg-[#1e293b] rounded-full overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                budgetPercentage > 90
                  ? 'bg-gradient-to-r from-[#3b82f6] to-[#ef4444]'
                  : 'bg-gradient-to-r from-[#0ea5e9] to-[#3b82f6]'
              }`}
              style={{ width: `${budgetPercentage}%` }}
            />
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5 pt-4 border-t border-[#1e293b]">
          <div
            onClick={() => setStatusFilter(statusFilter === 'active' ? 'all' : 'active')}
            className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-[#131d35] cursor-pointer transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-[#1e3a8a]/60 border border-[#3b82f6]/30 flex items-center justify-center text-[#60a5fa]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] text-[#64748b]">Activas / Pausadas</p>
              <p className="text-xs font-bold text-[#f1f5f9]">
                {activeSubs.length} / {pausedSubs.length}
              </p>
            </div>
          </div>

          <div
            onClick={() => onNavigate && onNavigate('insights')}
            className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-[#131d35] cursor-pointer transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-[#0c4a6e]/60 border border-[#0ea5e9]/30 flex items-center justify-center text-[#38bdf8]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] text-[#64748b]">Gasto Anual Est.</p>
              <p className="text-xs font-bold text-[#f1f5f9]">
                {formatCurrency(totalMonthlySpend * 12, currency)}
              </p>
            </div>
          </div>

          <div
            onClick={() => onNavigate && onNavigate('insights')}
            className="hidden sm:flex items-center gap-2.5 p-2 rounded-xl hover:bg-[#131d35] cursor-pointer transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-[#172554] border border-[#60a5fa]/30 flex items-center justify-center text-[#93c5fd]">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] text-[#64748b]">Tendencias</p>
              <p className="text-xs font-bold text-[#3b82f6]">Ver Insights →</p>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748b]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar suscripción por nombre..."
            className="w-full bg-[#0f172a] border border-[#1e293b] rounded-xl py-3 pl-10 pr-10 text-xs sm:text-sm text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Categories Bar */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 touch-manipulation ${
                  isActive
                    ? 'bg-[#3b82f6] text-white shadow-blue-glow scale-105 border border-[#3b82f6]'
                    : 'bg-[#0f172a] text-[#94a3b8] hover:bg-[#1e293b] border border-[#1e293b] hover:text-[#f1f5f9]'
                }`}
              >
                {cat === 'All' ? 'Todas' : cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* Subscriptions List (Tablet Responsive Grid) */}
      <section className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-[#f1f5f9]">Tus Suscripciones</h3>
            {!isLoading && <span className="text-xs text-[#64748b]">({filteredSubs.length})</span>}
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2 py-1 rounded-lg transition-all ${
                statusFilter === 'all' ? 'text-[#3b82f6] font-bold' : 'text-[#64748b]'
              }`}
            >
              Todas
            </button>
            <span className="text-[#334155]">•</span>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-2 py-1 rounded-lg transition-all ${
                statusFilter === 'active' ? 'text-[#3b82f6] font-bold' : 'text-[#64748b]'
              }`}
            >
              Activas
            </button>
            <span className="text-[#334155]">•</span>
            <button
              onClick={() => setStatusFilter('paused')}
              className={`px-2 py-1 rounded-lg transition-all ${
                statusFilter === 'paused' ? 'text-[#3b82f6] font-bold' : 'text-[#64748b]'
              }`}
            >
              Pausadas
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-[#0f172a] rounded-2xl p-4 border border-[#1e293b] flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#1e293b]" />
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-[#1e293b] rounded" />
                    <div className="h-3 w-16 bg-[#1e293b] rounded" />
                  </div>
                </div>
                <div className="space-y-2 text-right">
                  <div className="h-4 w-12 bg-[#1e293b] rounded ml-auto" />
                  <div className="h-3 w-8 bg-[#1e293b] rounded ml-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredSubs.length === 0 ? (
          searchQuery ? (
            <EmptyState 
              icon={<AlertCircle className="w-6 h-6" />}
              title={`No hay resultados para "${searchQuery}"`}
              description="Verifica la ortografía o intenta con otra palabra."
              actionLabel="Limpiar búsqueda"
              onAction={() => setSearchQuery('')}
            />
          ) : (
            <EmptyState 
              icon={<AlertCircle className="w-6 h-6" />}
              title="No se encontraron suscripciones"
              description="Prueba con otro filtro o agrega una nueva."
              actionLabel="Añadir Suscripción"
              actionIcon={<Plus className="w-4 h-4" />}
              onAction={onAddNew}
            />
          )
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredSubs.map((sub) => (
              <div
                key={sub.id}
                onClick={() => onSelectSubscription(sub)}
                className="bg-[#0f172a] rounded-2xl p-4 shadow-subtrack border border-[#1e293b] hover:border-[#3b82f6]/60 transition-all cursor-pointer flex items-center justify-between group active:scale-[0.98] touch-manipulation"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    style={{ backgroundColor: sub.iconBgColor || '#1e293b' }}
                    className="w-12 h-12 rounded-2xl text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0"
                  >
                    {sub.iconLetter || sub.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm sm:text-base font-semibold text-[#f1f5f9] group-hover:text-[#3b82f6] transition-colors truncate">
                        {sub.name}
                      </h4>
                      {sub.status === 'paused' && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#f59e0b]/20 text-[#f59e0b] font-bold">
                          Pausada
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[11px] text-[#64748b] truncate">{sub.category}</span>
                      <span className="text-[11px] text-[#475569]">•</span>
                      <span className="text-[11px] text-[#94a3b8]">
                        {sub.billingCycle === 'monthly' ? 'Mensual' : 'Anual'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-sm sm:text-base font-bold text-[#f1f5f9]">
                      {formatCurrency(sub.amount, currency)}
                    </span>
                    <p className="text-[11px] text-[#64748b]">
                      {sub.nextPaymentDate.replace('2026-', '').replace('-', '/')}
                    </p>
                  </div>
                  
                  <div className="relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(activeMenuId === sub.id ? null : sub.id);
                      }}
                      className="p-1.5 text-[#64748b] hover:text-[#f1f5f9] hover:bg-[#1e293b] rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    
                    {activeMenuId === sub.id && (
                      <div className="absolute right-0 top-10 mt-1 w-32 bg-[#1e293b] rounded-xl shadow-lg border border-[#334155] z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(null);
                            onEditSubscription && onEditSubscription(sub);
                          }}
                          className="w-full text-left px-4 py-2.5 text-xs font-semibold text-[#f1f5f9] hover:bg-[#334155] transition-colors flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4 text-[#38bdf8]" />
                          Editar
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(null);
                            onDeleteSubscription && onDeleteSubscription(sub.id);
                          }}
                          className="w-full text-left px-4 py-2.5 text-xs font-semibold text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Cerrar menú si se hace clic fuera (Overlay transparente) */}
      {activeMenuId && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setActiveMenuId(null)}
        />
      )}

      {/* Adjust Budget Modal */}
      {showBudgetModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-[#0f172a] rounded-2xl p-6 max-w-sm w-full shadow-subtrack-lg border border-[#1e293b]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#f1f5f9]">Ajustar Meta Mensual</h3>
              <button
                onClick={() => setShowBudgetModal(false)}
                className="p-1 rounded-full text-[#94a3b8] hover:bg-[#1e293b]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveBudget} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#94a3b8] mb-1.5">
                  Monto mensual límite ({currency})
                </label>
                <input
                  type="number"
                  step="1"
                  min="10"
                  value={tempBudget}
                  onChange={(e) => setTempBudget(e.target.value)}
                  className="w-full bg-[#131d35] border border-[#1e293b] rounded-xl py-2.5 px-3.5 text-base font-bold text-[#f1f5f9] focus:outline-none focus:border-[#3b82f6]"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBudgetModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#334155] text-xs font-semibold text-[#f1f5f9] hover:bg-[#1e293b]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#3b82f6] hover:bg-[#2563eb] text-white text-xs font-bold shadow-blue-glow flex items-center justify-center gap-1"
                >
                  <Check className="w-4 h-4" />
                  <span>Guardar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

