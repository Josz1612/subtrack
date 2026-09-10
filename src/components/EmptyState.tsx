import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon,
}) => {
  return (
    <div className="bg-[#0f172a] rounded-2xl p-8 text-center border border-[#1e293b] shadow-subtrack flex flex-col items-center justify-center min-h-[220px]">
      <div className="w-14 h-14 rounded-full bg-[#1e293b] flex items-center justify-center text-[#64748b] mb-4 shadow-sm border border-[#334155]">
        {icon}
      </div>
      <h3 className="text-sm sm:text-base font-bold text-[#f1f5f9]">{title}</h3>
      <p className="text-xs sm:text-sm text-[#94a3b8] mt-1.5 max-w-[260px] mx-auto leading-relaxed">
        {description}
      </p>
      
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-6 px-5 py-2.5 bg-[#1e3a8a]/40 hover:bg-[#3b82f6] text-[#38bdf8] hover:text-white rounded-xl text-xs sm:text-sm font-bold border border-[#3b82f6]/30 hover:border-[#3b82f6] hover:shadow-blue-glow transition-all active:scale-95 inline-flex items-center gap-2 touch-manipulation"
        >
          {actionIcon}
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};
