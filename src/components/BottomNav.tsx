import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ScreenId } from '../types';
import { LayoutGrid, Calendar, BarChart3, Settings } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentScreen = (location.pathname.substring(1) || 'payments') as ScreenId;
  const isAuthScreen =
    currentScreen === 'register' ||
    currentScreen === 'google_select' ||
    currentScreen === 'google_consent' ||
    currentScreen === 'onboarding';

  if (isAuthScreen) {
    return null;
  }

  const navItems = [
    {
      id: 'overview' as ScreenId,
      label: 'Overview',
      icon: LayoutGrid,
    },
    {
      id: 'payments' as ScreenId,
      label: 'Payments',
      icon: Calendar,
    },
    {
      id: 'insights' as ScreenId,
      label: 'Insights',
      icon: BarChart3,
    },
    {
      id: 'settings' as ScreenId,
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full z-50 bg-[#070b14]/95 backdrop-blur-md border-t border-[#1e293b] pb-safe shadow-[0_-8px_30px_rgba(0,0,0,0.7)]">
      <div className="w-full mx-auto h-20 px-3 sm:px-6 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;

          return (
            <button
              key={item.id}
              onClick={() => navigate(`/${item.id}`)}
              className={`flex flex-col items-center justify-center min-w-[64px] sm:min-w-[80px] min-h-[48px] py-1.5 px-3 rounded-2xl transition-all duration-200 active:scale-95 touch-manipulation ${
                isActive
                  ? 'bg-[#1e3a8a]/40 text-[#60a5fa] font-bold border border-[#3b82f6]/40 shadow-blue-glow'
                  : 'text-[#64748b] hover:bg-[#0f172a] hover:text-[#94a3b8]'
              }`}
            >
              <Icon
                className={`w-5 h-5 mb-1 transition-transform ${
                  isActive ? 'text-[#3b82f6] stroke-[2.5] scale-110' : 'text-[#64748b]'
                }`}
              />
              <span className={`text-[11px] sm:text-xs ${isActive ? 'font-bold text-[#93c5fd]' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

