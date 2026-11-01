import React from 'react';
import { Pencil, Trash2, FileText, Image as ImageIcon } from 'lucide-react';
import { Expense, formatCurrencyBRL } from '../types';

interface ExpenseItemProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  onViewReceipt: (receiptUrl: string, description: string) => void;
}

export const ExpenseItem: React.FC<ExpenseItemProps> = ({
  expense,
  onEdit,
  onDelete,
  onViewReceipt,
}) => {
  const isLabor = expense.category === 'mao_de_obra';

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 transition-all hover:shadow-md hover:border-slate-300">
      
      {/* Left section: Category badge, date, and description */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Badge matching screenshot */}
          {isLabor ? (
            <span className="inline-flex items-center gap-1 bg-[#fef3c7] text-[#92400e] text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-amber-200 shadow-2xs">
              Mão de Obra
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 bg-[#dbeafe] text-[#1e40af] text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-blue-200 shadow-2xs">
              Material
            </span>
          )}

          {/* Date */}
          <span className="text-xs font-medium text-slate-400">
            {expense.date}
          </span>

          {/* Receipt thumbnail button if attached */}
          {expense.receiptUrl && (
            <button
              onClick={() => onViewReceipt(expense.receiptUrl!, expense.description)}
              className="inline-flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-emerald-200 transition-colors cursor-pointer"
              title="Ver foto do comprovante"
            >
              <ImageIcon className="w-3 h-3 text-emerald-600" />
              <span>Nota Anexa</span>
            </button>
          )}
        </div>

        {/* Description title matching screenshot */}
        <h3 className="mt-2 text-sm sm:text-base font-extrabold text-slate-800 leading-snug tracking-tight break-words">
          {expense.description}
        </h3>
      </div>

      {/* Right section: Amount and action buttons */}
      <div className="flex items-center justify-between sm:justify-end gap-3.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
        {/* Formatted amount */}
        <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
          {formatCurrencyBRL(expense.amount)}
        </span>

        {/* Action buttons (pencil edit & trash delete) */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onEdit(expense)}
            title="Editar gasto"
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200/90 transition-colors cursor-pointer active:scale-95"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(expense.id)}
            title="Excluir gasto"
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200/90 hover:border-rose-200 transition-colors cursor-pointer active:scale-95"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
