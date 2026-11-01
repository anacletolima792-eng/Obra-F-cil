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
    <div className="grid grid-cols-3 gap-2 sm:gap-3.5 my-1.5 sm:my-2.5">
      
      {/* 1. Material Card */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-4 border-2 border-blue-500 shadow-xs flex flex-col justify-between min-w-0 transition-all hover:shadow-sm">
        <div className="flex items-center gap-1 sm:gap-1.5 text-slate-700 min-w-0">
          <span className="text-xs sm:text-base shrink-0" role="img" aria-label="Material">📦</span>
          <span className="uppercase text-[9px] min-[380px]:text-[10px] sm:text-xs font-black tracking-wider text-slate-700 truncate">
            MATERIAL
          </span>
        </div>
        <div className="mt-1 sm:mt-2 text-xs min-[360px]:text-sm sm:text-lg md:text-xl font-black text-blue-600 tracking-tight whitespace-nowrap truncate">
          {formatCurrencyBRL(materialTotal)}
        </div>
      </div>

      {/* 2. Mão de Obra Card */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-4 border-2 border-amber-500 shadow-xs flex flex-col justify-between min-w-0 transition-all hover:shadow-sm">
        <div className="flex items-center gap-1 sm:gap-1.5 text-slate-700 min-w-0">
          <span className="text-xs sm:text-base shrink-0" role="img" aria-label="Mão de Obra">🪄</span>
          <span className="uppercase text-[9px] min-[380px]:text-[10px] sm:text-xs font-black tracking-wider text-slate-700 truncate">
            MÃO DE OBRA
          </span>
        </div>
        <div className="mt-1 sm:mt-2 text-xs min-[360px]:text-sm sm:text-lg md:text-xl font-black text-amber-600 tracking-tight whitespace-nowrap truncate">
          {formatCurrencyBRL(laborTotal)}
        </div>
      </div>

      {/* 3. Total Card */}
      <div className="bg-[#0e1726] rounded-xl sm:rounded-2xl p-2.5 sm:p-4 shadow-sm flex flex-col justify-between border border-slate-800 min-w-0 transition-all hover:shadow-md">
        <div className="flex items-center gap-1 sm:gap-1.5 text-slate-300 min-w-0">
          <span className="text-xs sm:text-base shrink-0" role="img" aria-label="Total">📊</span>
          <span className="uppercase text-[9px] min-[380px]:text-[10px] sm:text-xs font-black tracking-wider text-slate-200 truncate">
            TOTAL
          </span>
        </div>
        <div className="mt-1 sm:mt-2 text-xs min-[360px]:text-sm sm:text-lg md:text-xl font-black text-amber-400 tracking-tight whitespace-nowrap truncate">
          {formatCurrencyBRL(grandTotal)}
        </div>
      </div>

    </div>
  );
};
