export type ExpenseCategory = 'material' | 'mao_de_obra';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  receiptUrl?: string;
  userId: string;
  createdAt: string;
  updatedAt?: string;
}

export const INITIAL_IMAGE_EXPENSES: Omit<Expense, 'id' | 'userId' | 'createdAt'>[] = [];

export function formatCurrencyBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function parseBRLInput(input: string): number {
  // Strip R$, spaces, dots used as thousand separators, and convert comma to dot
  const clean = input
    .replace(/[R$\s]/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
}
