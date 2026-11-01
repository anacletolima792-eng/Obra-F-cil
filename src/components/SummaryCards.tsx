import React from 'react';
import { formatCurrencyBRL } from '../types';

interface SummaryCardsProps {
  materialTotal: number;
  laborTotal: number;
  grandTotal: number;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  materialTotal,
  laborTotal,
  grandTotal,
}) => {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3 my-1 sm:my-1.5">
      
      {/* 1. Material Card */}
      <div className="bg-white rounded-xl p-2 sm:p-2.5 border border-blue-400 shadow-2xs flex flex-col justify-between min-w-0 transition-all hover:border-blue-500">
        <div className="flex items-center gap-1 sm:gap-1.5 text-slate-700 min-w-0">
          <span className="text-xs sm:text-sm shrink-0" role="img" aria-label="Material">📦</span>
          <span className="uppercase text-[9px] min-[380px]:text-[10px] sm:text-xs font-bold tracking-wider text-slate-600 truncate">
            MATERIAL
          </span>
        </div>
        <div className="mt-0.5 sm:mt-1 text-xs min-[360px]:text-sm sm:text-base font-extrabold text-blue-600 tracking-tight whitespace-nowrap truncate">
          {formatCurrencyBRL(materialTotal)}
        </div>
      </div>

      {/* 2. Mão de Obra Card */}
      <div className="bg-white rounded-xl p-2 sm:p-2.5 border border-amber-400 shadow-2xs flex flex-col justify-between min-w-0 transition-all hover:border-amber-500">
        <div className="flex items-center gap-1 sm:gap-1.5 text-slate-700 min-w-0">
          <span className="text-xs sm:text-sm shrink-0" role="img" aria-label="Mão de Obra">🪄</span>
          <span className="uppercase text-[9px] min-[380px]:text-[10px] sm:text-xs font-bold tracking-wider text-slate-600 truncate">
            MÃO DE OBRA
          </span>
        </div>
        <div className="mt-0.5 sm:mt-1 text-xs min-[360px]:text-sm sm:text-base font-extrabold text-amber-600 tracking-tight whitespace-nowrap truncate">
          {formatCurrencyBRL(laborTotal)}
        </div>
      </div>

      {/* 3. Total Card */}
      <div className="bg-[#0e1726] rounded-xl p-2 sm:p-2.5 shadow-2xs flex flex-col justify-between border border-slate-800 min-w-0 transition-all">
        <div className="flex items-center gap-1 sm:gap-1.5 text-slate-300 min-w-0">
          <span className="text-xs sm:text-sm shrink-0" role="img" aria-label="Total">📊</span>
          <span className="uppercase text-[9px] min-[380px]:text-[10px] sm:text-xs font-bold tracking-wider text-slate-300 truncate">
            TOTAL
          </span>
        </div>
        <div className="mt-0.5 sm:mt-1 text-xs min-[360px]:text-sm sm:text-base font-black text-amber-400 tracking-tight whitespace-nowrap truncate">
          {formatCurrencyBRL(grandTotal)}
        </div>
      </div>

    </div>
  );
};
