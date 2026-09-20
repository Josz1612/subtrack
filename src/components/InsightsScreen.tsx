import React, { useState } from 'react';
import { Subscription, Currency } from '../types';
import { formatCurrency } from '../data/initialData';
import { ArrowDown, Film, Briefcase, Zap, Heart, Code2, ChevronRight, Layers, Sparkles, ArrowLeft, Plus } from 'lucide-react';
import { EmptyState } from './EmptyState';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface InsightsScreenProps {
  isLoading?: boolean;
  subscriptions: Subscription[];
  currency: Currency;
  onSelectCategory?: (category: string) => void;
  onShowToast?: (text: string, type?: 'success' | 'info' | 'error') => void;
  onAddNew?: () => void;
  onBack?: () => void;
}

export const InsightsScreen: React.FC<InsightsScreenProps> = ({
  isLoading,
  subscriptions,
  currency,
  onSelectCategory,
  onShowToast,
  onAddNew,
  onBack,
}) => {
  const [activeMonthIdx, setActiveMonthIdx] = useState<number>(5); // March / Current
  const [selectedCatDetail, setSelectedCatDetail] = useState<string | null>(null);

  const activeSubs = subscriptions.filter((s) => s.status === 'active');
  const currentTotal = activeSubs.reduce((sum, s) => sum + s.amount, 0);

  // Monthly trends data
  const trends = [
    { month: 'Oct', amount: 130.0, height: '60%' },
    { month: 'Nov', amount: 138.5, height: '75%' },
    { month: 'Dic', amount: 155.0, height: '90%' },
    { month: 'Ene', amount: 148.0, height: '85%' },
    { month: 'Feb', amount: 139.0, height: '70%' },
    { month: 'Mar', amount: currentTotal, height: '65%' },
  ];

  // Dynamic category calculations
  const entertainmentTotal = subscriptions
    .filter((s) => s.status === 'active' && s.category === 'Entertainment')
    .reduce((sum, s) => sum + s.amount, 0);

  const productivityTotal = subscriptions
    .filter((s) => s.status === 'active' && s.category === 'Productivity')
    .reduce((sum, s) => sum + s.amount, 0);

  const utilitiesTotal = subscriptions
    .filter((s) => s.status === 'active' && s.category === 'Utilities')
    .reduce((sum, s) => sum + s.amount, 0);

  const healthTotal = subscriptions
    .filter((s) => s.status === 'active' && s.category === 'Health')
    .reduce((sum, s) => sum + s.amount, 0);

  const devTotal = subscriptions
    .filter((s) => s.status === 'active' && s.category === 'Developer')
    .reduce((sum, s) => sum + s.amount, 0);

  const total =
    entertainmentTotal + productivityTotal + utilitiesTotal + healthTotal + devTotal;

  const entPercentNum = total > 0 ? Math.round((entertainmentTotal / total) * 100) : 0;
  const prodPercentNum = total > 0 ? Math.round((productivityTotal / total) * 100) : 0;
  const utilPercentNum = total > 0 ? Math.round((utilitiesTotal / total) * 100) : 0;
  const healthPercentNum = total > 0 ? Math.round((healthTotal / total) * 100) : 0;
  const devPercentNum = total > 0 ? Math.round((devTotal / total) * 100) : 0;

  const categoryList = [
    {
      name: 'Entertainment',
      label: 'Entretenimiento',
      amount: entertainmentTotal,
      percent: entPercentNum,
      icon: Film,
      bgColor: 'bg-[#1e3a8a]/40',
      textColor: 'text-[#60a5fa]',
      barColor: 'bg-[#3b82f6]',
      borderColor: 'border-[#3b82f6]/30',
    },
    {
      name: 'Productivity',
      label: 'Productividad',
      amount: productivityTotal,
      percent: prodPercentNum,
      icon: Briefcase,
      bgColor: 'bg-[#0c4a6e]/40',
      textColor: 'text-[#38bdf8]',
      barColor: 'bg-[#0ea5e9]',
      borderColor: 'border-[#0ea5e9]/30',
    },
    {
      name: 'Utilities',
      label: 'Servicios',
      amount: utilitiesTotal,
      percent: utilPercentNum,
      icon: Zap,
      bgColor: 'bg-[#172554]/40',
      textColor: 'text-[#93c5fd]',
      barColor: 'bg-[#2563eb]',
      borderColor: 'border-[#2563eb]/30',
    },
    {
      name: 'Health',
      label: 'Salud y Fitness',
      amount: healthTotal,
      percent: healthPercentNum,
      icon: Heart,
      bgColor: 'bg-[#1e1b4b]/40',
      textColor: 'text-[#a78bfa]',
      barColor: 'bg-[#818cf8]',
      borderColor: 'border-[#818cf8]/30',
    },
    {
      name: 'Developer',
      label: 'Desarrollo',
      amount: devTotal,
      percent: devPercentNum,
      icon: Code2,
      bgColor: 'bg-[#0f2e3d]/40',
      textColor: 'text-[#2dd4bf]',
      barColor: 'bg-[#14b8a6]',
      borderColor: 'border-[#14b8a6]/30',
    },
  ];

  return (
    <main className="max-w-[768px] lg:max-w-[880px] mx-auto px-4 sm:px-6 py-4 pb-28 flex flex-col gap-6">


      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#f1f5f9] mb-1 tracking-tight">
          Estadísticas & Análisis
        </h1>
        <p className="text-sm text-[#94a3b8]">Resumen financiero y distribución de tus suscripciones.</p>
      </div>

      {/* Total Monthly Spend (Main Summary) */}
      <section className="bg-[#0f172a] rounded-[24px] p-6 sm:p-7 border border-[#1e293b] shadow-subtrack relative overflow-hidden group">
        <div className="relative z-10">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-2">
            GASTO MENSUAL TOTAL
          </h2>
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-bold text-[#3b82f6] tracking-tight">
              {formatCurrency(currentTotal, currency)}
            </span>
            <span className="text-xs font-semibold text-[#60a5fa] bg-[#1e3a8a]/40 px-3 py-1 rounded-full flex items-center gap-1 border border-[#3b82f6]/40 shadow-xs">
              <ArrowDown className="w-3.5 h-3.5" />
              <span>Ahorro de $12.00 vs mes anterior</span>
            </span>
          </div>
        </div>

        {/* Subtle decorative blue glow */}
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#3b82f6]/15 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
      </section>

      {/* Spending Trends (Bar Chart) */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-3 px-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-[#f1f5f9]">Tendencia de Gastos</h2>
            <span className="text-xs text-[#64748b] hidden sm:inline">(Últimos 6 meses)</span>
          </div>
          <span className="text-xs font-bold text-[#3b82f6] flex items-center gap-0.5">
            <span>Mes seleccionado: {trends[activeMonthIdx]?.month}</span>
          </span>
        </div>

        <div className="bg-[#0f172a] rounded-[24px] p-5 sm:p-6 border border-[#1e293b] shadow-subtrack">
          <div className="flex items-end justify-between h-44 sm:h-52 gap-2 sm:gap-4 pt-6 pb-2 px-1">
            {isLoading ? (
              [1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex flex-col items-center w-full gap-2 animate-pulse">
                  <div className="w-full bg-[#1e293b] rounded-t-xl relative h-32 sm:h-38" />
                  <div className="h-3 w-8 bg-[#1e293b] rounded" />
                </div>
              ))
            ) : trends.map((item, idx) => {
              const isCurrent深 = idx === activeMonthIdx;
              return (
                <div
                  key={item.month}
                  onClick={() => setActiveMonthIdx(idx)}
                  className="flex flex-col items-center w-full gap-2 group cursor-pointer touch-manipulation"
                >
                  <div className="w-full bg-[#131d35] rounded-t-xl relative h-32 sm:h-38 flex items-end overflow-visible">
                    {/* Tooltip */}
                    {isCurrent深 && (
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1e293b] text-[#f1f5f9] text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-subtrack whitespace-nowrap z-20 animate-in fade-in zoom-in-90 border border-[#3b82f6]/40">
                        {formatCurrency(item.amount, currency)}
                      </div>
                    )}

                    <div
                      className={`w-full rounded-t-xl transition-all duration-300 ${isCurrent深
                        ? 'bg-[#3b82f6] shadow-blue-glow'
                        : 'bg-[#3b82f6]/30 group-hover:bg-[#3b82f6]/60'
                        }`}
                      style={{ height: item.height }}
                    />
                  </div>
                  <span
                    className={`text-xs ${isCurrent深 ? 'font-bold text-[#3b82f6]' : 'font-medium text-[#94a3b8]'
                      }`}
                  >
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Category Breakdown (Tablet 2-Column Responsive Grid) */}
      <section className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-lg font-bold text-[#f1f5f9]">Desglose por Categoría</h2>
          <span className="text-xs text-[#64748b]">Toca una para ver detalle</span>
        </div>

        {/* Gráfica de Dona */}
        {!isLoading && total > 0 && (
          <div className="bg-[#0f172a] rounded-[24px] p-5 border border-[#1e293b] shadow-subtrack mb-4">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryList.filter(c => c.amount > 0)}
                  dataKey="amount"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  stroke="none"
                >
                  {categoryList.filter(c => c.amount > 0).map((entry, index) => {
                    const VIBRANT_COLORS = ['#FF6B6B', '#FFB703', '#06D6A0', '#9D4EDD', '#00B4D8'];
                    const hexColor = VIBRANT_COLORS[index % VIBRANT_COLORS.length];
                    return <Cell key={`cell-${index}`} fill={hexColor} />;
                  })}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value, currency)}
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#f1f5f9' }}
                  itemStyle={{ color: '#f1f5f9' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {isLoading ? (
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-[#0f172a] rounded-2xl p-4 sm:p-5 border border-[#1e293b] animate-pulse">
                <div className="flex items-center gap-3.5 mb-3">
                  <div className="w-11 h-11 rounded-xl bg-[#1e293b] shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between">
                      <div className="h-4 w-24 bg-[#1e293b] rounded" />
                      <div className="h-4 w-8 bg-[#1e293b] rounded" />
                    </div>
                    <div className="h-3 w-32 bg-[#1e293b] rounded" />
                  </div>
                </div>
                <div className="w-full h-2 bg-[#1e293b] rounded-full" />
              </div>
            ))
          ) : categoryList.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCatDetail === cat.name;
            const subsInCat = subscriptions.filter(
              (s) => s.category === cat.name && s.status === 'active'
            );

            return (
              <div
                key={cat.name}
                onClick={() => {
                  setSelectedCatDetail(isSelected ? null : cat.name);
                  if (onSelectCategory) onSelectCategory(cat.name);
                }}
                className={`bg-[#0f172a] rounded-2xl p-4 sm:p-5 border transition-all duration-200 cursor-pointer active:scale-[0.98] touch-manipulation ${isSelected ? 'border-[#3b82f6] shadow-blue-glow' : 'border-[#1e293b] hover:border-[#3b82f6]/40'
                  }`}
              >
                <div className="flex items-center gap-3.5 mb-3">
                  <div
                    className={`w-11 h-11 rounded-xl ${cat.bgColor} flex items-center justify-center ${cat.textColor} border ${cat.borderColor} shrink-0`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <h3 className="text-sm font-bold text-[#f1f5f9] truncate">{cat.label}</h3>
                      <span className={`text-sm font-bold ${cat.textColor}`}>{cat.percent}%</span>
                    </div>
                    <div className="text-xs text-[#94a3b8]">
                      {formatCurrency(cat.amount, currency)} • {subsInCat.length} servicios
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-[#131d35] rounded-full overflow-hidden">
                  {cat.percent > 0 && (
                    <div
                      className={`h-full ${cat.barColor} rounded-full transition-all duration-700`}
                      style={{ width: `${Math.min(cat.percent, 100)}%` }}
                    />
                  )}
                </div>

                {/* Category Drilldown List */}
                {isSelected && (
                  <div className="mt-3 pt-3 border-t border-[#1e293b] space-y-1.5 animate-in fade-in duration-150">
                    {subsInCat.length > 0 ? (
                      subsInCat.map((s) => (
                        <div key={s.id} className="flex justify-between text-xs py-1">
                          <span className="text-[#cbd5e1] font-medium truncate">{s.name}</span>
                          <span className="text-[#93c5fd] font-bold">
                            {formatCurrency(s.amount, currency)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="-mx-2 scale-95 origin-top">
                        <EmptyState
                          icon={<Icon className="w-5 h-5" />}
                          title="Categoría Vacía"
                          description="No hay suscripciones activas en esta categoría."
                          actionLabel="Añadir primera suscripción"
                          actionIcon={<Plus className="w-4 h-4" />}
                          onAction={onAddNew}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
};

