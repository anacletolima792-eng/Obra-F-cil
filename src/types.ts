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

export const INITIAL_IMAGE_EXPENSES: Omit<Expense, 'id' | 'userId' | 'createdAt'>[] = [
  {
    description: 'Diária do Pedreiro',
    amount: 250.00,
    category: 'mao_de_obra',
    date: '29/10/2026',
  },
  {
    description: 'ELETRICISTA',
    amount: 250.00,
    category: 'mao_de_obra',
    date: '31/10/2026',
  },
  {
    description: 'Cimento',
    amount: 210.00,
    category: 'material',
    date: '31/10/2026',
  },
  {
    description: 'Sacos de Cimento (10x)',
    amount: 350.00,
    category: 'material',
    date: '28/10/2026',
  },
  {
    description: 'Diária do Pedreiro',
    amount: 250.00,
    category: 'mao_de_obra',
    date: '29/10/2026',
  },
  {
    description: 'Cimento',
    amount: 210.00,
    category: 'material',
    date: '31/10/2026',
  },
  {
    description: 'Sacos de Cimento (10x)',
    amount: 350.00,
    category: 'material',
    date: '28/10/2026',
  },
  {
    description: 'ELETRICISTA',
    amount: 250.00,
    category: 'mao_de_obra',
    date: '31/10/2026',
  },
  {
    description: '10 CIMENTO, 5 TROPICAL, 5 SC DE AREIA, 10 SACO DE BRITA, 1 LAPIS PEDREIRO',
    amount: 350.00,
    category: 'material',
    date: '31/10/2026',
  },
  {
    description: '10 CIMENTO, 5 TROPICAL, 5 SC DE AREIA, 10 SACO DE BRITA, 1 LAPIS PEDREIRO',
    amount: 350.00,
    category: 'material',
    date: '31/10/2026',
  },
];

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
