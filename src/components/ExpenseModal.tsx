import React, { useState, useEffect, useRef } from 'react';
import { X, Camera, Plus, Check, Trash2, Calendar, Loader2 } from 'lucide-react';
import { Expense, ExpenseCategory, parseBRLInput, formatCurrencyBRL } from '../types';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expenseData: {
    description: string;
    amount: number;
    category: ExpenseCategory;
    date: string;
    receiptUrl?: string;
  }) => Promise<void>;
  editingExpense?: Expense | null;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingExpense,
}) => {
  const [description, setDescription] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('material');
  const [date, setDate] = useState('');
  const [receiptUrl, setReceiptUrl] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Format today's date as DD/MM/YYYY
  const getTodayFormatted = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  useEffect(() => {
    if (editingExpense) {
      setDescription(editingExpense.description);
      // Format number to R$ string without prefix for easier editing
      setAmountStr(editingExpense.amount.toFixed(2).replace('.', ','));
      setCategory(editingExpense.category);
      setDate(editingExpense.date || getTodayFormatted());
      setReceiptUrl(editingExpense.receiptUrl);
    } else {
      setDescription('');
      setAmountStr('');
      setCategory('material');
      setDate(getTodayFormatted());
      setReceiptUrl(undefined);
    }
    setErrorMessage('');
  }, [editingExpense, isOpen]);

  if (!isOpen) return null;

  // Handle image upload and compress via canvas
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Por favor selecione um arquivo de imagem válido.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Compress image to max dimension 900px to maintain crispness while keeping size small for Firestore (<200KB)
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 900;

        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.72);
          setReceiptUrl(compressedDataUrl);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedDesc = description.trim();
    if (!trimmedDesc) {
      setErrorMessage('Por favor informe a descrição do gasto.');
      return;
    }

    const parsedAmount = parseBRLInput(amountStr);
    if (parsedAmount <= 0) {
      setErrorMessage('Por favor informe um valor válido maior que zero (ex: 350,00).');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        description: trimmedDesc,
        amount: parsedAmount,
        category,
        date: date.trim() || getTodayFormatted(),
        receiptUrl: receiptUrl || undefined,
      });
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMessage('Erro ao salvar gasto. Verifique os dados e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      
      {/* Modal Dialog Container matching screenshot */}
      <div 
        className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span className="text-xl">➕</span>
              <span>{editingExpense ? 'Editar Gasto' : 'Lançar Novo Gasto'}</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl p-3 font-medium">
              {errorMessage}
            </div>
          )}

          {/* 1. Categoria (Em primeiro, acima de Descrição) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Categoria
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Material Button */}
              <button
                type="button"
                onClick={() => setCategory('material')}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  category === 'material'
                    ? 'bg-[#dbeafe] text-[#1e40af] border-2 border-blue-400 shadow-xs'
                    : 'bg-[#f1f5f9] text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="text-base" role="img" aria-label="Material">📦</span>
                <span>Material</span>
              </button>

              {/* Mão de Obra Button */}
              <button
                type="button"
                onClick={() => setCategory('mao_de_obra')}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  category === 'mao_de_obra'
                    ? 'bg-[#fef3c7] text-[#92400e] border-2 border-amber-400 shadow-xs'
                    : 'bg-[#f1f5f9] text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="text-base" role="img" aria-label="Mão de Obra">👷</span>
                <span>Mão de Obra</span>
              </button>
            </div>
          </div>

          {/* 2. Descrição */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Descrição
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição (ex: Sacos de Cimento)"
              required
              className="w-full px-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* 3. Valor em R$ */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Valor em R$
            </label>
            <div className="relative">
              <input
                type="text"
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                placeholder="Valor em R$ (ex: 350,00)"
                required
                className="w-full px-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Date Picker Input (subtle) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Data do Gasto
            </label>
            <div className="relative">
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="DD/MM/AAAA (ex: 31/10/2026)"
                className="w-full px-4 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <Calendar className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          {/* 4. Foto da Nota de Venda / Comprovante (Opcional) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Foto da Nota de Venda / Comprovante (Opcional)
            </label>
            
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              capture="environment"
              onChange={handleImageChange}
              className="hidden"
            />

            {receiptUrl ? (
              <div className="relative border-2 border-slate-200 rounded-2xl p-2 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={receiptUrl}
                    alt="Comprovante"
                    className="w-14 h-14 object-cover rounded-xl border border-slate-300 shadow-xs"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      Comprovante anexado
                    </span>
                    <span className="text-[11px] text-emerald-600 font-medium">
                      ✓ Pronto para salvar
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setReceiptUrl(undefined)}
                  className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Remover foto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-4 px-4 border-2 border-dashed border-blue-300 hover:border-blue-500 rounded-2xl bg-blue-50/40 hover:bg-blue-50/80 text-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm font-semibold"
              >
                <span className="text-lg">📷</span>
                <span>Tirar foto da nota ou escolher da galeria</span>
              </button>
            )}
          </div>

          {/* Action Buttons matching screenshot */}
          <div className="grid grid-cols-2 gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-[#f1f5f9] hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors cursor-pointer text-center"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-[#f59e0b] hover:bg-[#d97706] text-slate-950 font-black rounded-xl text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Salvando...</span>
                </>
              ) : (
                <span>{editingExpense ? 'Salvar Gasto' : 'Adicionar Gasto'}</span>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
