import React, { useState, useEffect } from 'react';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  Plus,
  Search,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import {
  db,
  auth,
  googleProvider,
  testConnection,
  handleFirestoreError,
  OperationType,
} from './firebase';
import {
  Expense,
  ExpenseCategory,
  INITIAL_IMAGE_EXPENSES,
  formatCurrencyBRL,
} from './types';
import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { ExpenseItem } from './components/ExpenseItem';
import { ExpenseModal } from './components/ExpenseModal';
import { ReceiptViewerModal } from './components/ReceiptViewerModal';
import { Sidebar } from './components/Sidebar';

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // In-memory / Realtime Expenses list
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Sidebar and Configuration States
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [projectName, setProjectName] = useState<string>(
    () => localStorage.getItem('obra_facil_project_name') || 'Minha Obra'
  );
  const [budgetLimit, setBudgetLimit] = useState<number>(
    () => Number(localStorage.getItem('obra_facil_budget_limit')) || 5000
  );

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [activeReceipt, setActiveReceipt] = useState<{ url: string; desc: string } | null>(null);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  // 1. Initial Connection Test
  useEffect(() => {
    testConnection().then((connected) => {
      setIsFirebaseConnected(connected);
    });
  }, []);

  // 2. Auth State Listener
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribeAuth();
  }, []);

  // 3. Real-time Firestore Sync when User is Authenticated, or Demo Seed when Guest
  useEffect(() => {
    if (!user) {
      // Load initial replica data matching user screenshot
      const localStored = localStorage.getItem('obra_facil_guest_expenses');
      if (localStored) {
        try {
          setExpenses(JSON.parse(localStored));
          return;
        } catch {
          // fallback to seed
        }
      }

      // Default sample matching the user's provided screenshot
      const sampleList: Expense[] = INITIAL_IMAGE_EXPENSES.map((item, idx) => ({
        ...item,
        id: `demo_${idx + 1}`,
        userId: 'guest',
        createdAt: new Date().toISOString(),
      }));
      setExpenses(sampleList);
      return;
    }

    // Authenticated user: Listen to real-time updates from their Firestore subcollection
    setIsSyncing(true);
    const expensesRef = collection(db, 'users', user.uid, 'expenses');
    const q = query(expensesRef);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: Expense[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          items.push({
            id: docSnap.id,
            description: data.description || '',
            amount: Number(data.amount) || 0,
            category: data.category as ExpenseCategory,
            date: data.date || '',
            receiptUrl: data.receiptUrl,
            userId: data.userId || user.uid,
            createdAt: data.createdAt || new Date().toISOString(),
            updatedAt: data.updatedAt,
          });
        });

        // If newly logged in user has an empty database, give option or auto-populate
        setExpenses(items);
        setIsSyncing(false);
        setIsFirebaseConnected(true);
      },
      (error) => {
        setIsSyncing(false);
        handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/expenses`);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Auth Handlers
  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      showNotice('Conectado com sucesso ao Firebase!');
    } catch (error) {
      console.error('Sign-in error:', error);
      alert('Não foi possível realizar o login com o Google. Tente novamente.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      showNotice('Sessão encerrada.');
    } catch (error) {
      console.error('Sign-out error:', error);
    }
  };

  const showNotice = (msg: string) => {
    setFeedbackNotice(msg);
    setTimeout(() => setFeedbackNotice(null), 3500);
  };

  // Seed sample expenses directly to Firestore for authenticated user
  const handleSeedToFirebase = async () => {
    if (!user) {
      handleSignIn();
      return;
    }

    setIsSyncing(true);
    try {
      const now = new Date().toISOString();
      for (let i = 0; i < INITIAL_IMAGE_EXPENSES.length; i++) {
        const item = INITIAL_IMAGE_EXPENSES[i];
        const newId = `exp_${Date.now()}_${i}`;
        const docRef = doc(db, 'users', user.uid, 'expenses', newId);
        await setDoc(docRef, {
          description: item.description,
          amount: item.amount,
          category: item.category,
          date: item.date,
          userId: user.uid,
          createdAt: now,
        });
      }
      showNotice('Gastos da imagem importados com sucesso para seu Firebase!');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}/expenses`);
    } finally {
      setIsSyncing(false);
    }
  };

  // Add or Edit Expense
  const handleSaveExpense = async (expenseData: {
    description: string;
    amount: number;
    category: ExpenseCategory;
    date: string;
    receiptUrl?: string;
  }) => {
    if (user) {
      // Save directly to Firestore
      const path = editingExpense
        ? `users/${user.uid}/expenses/${editingExpense.id}`
        : `users/${user.uid}/expenses`;

      try {
        const docId = editingExpense ? editingExpense.id : `exp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const docRef = doc(db, 'users', user.uid, 'expenses', docId);

        const payload: Record<string, any> = {
          description: expenseData.description,
          amount: expenseData.amount,
          category: expenseData.category,
          date: expenseData.date,
          userId: user.uid,
          createdAt: editingExpense ? editingExpense.createdAt : new Date().toISOString(),
        };

        if (expenseData.receiptUrl) {
          payload.receiptUrl = expenseData.receiptUrl;
        }

        if (editingExpense) {
          payload.updatedAt = new Date().toISOString();
        }

        await setDoc(docRef, payload, { merge: true });
        showNotice(editingExpense ? 'Gasto atualizado no Firebase!' : 'Gasto lançado no Firebase!');
      } catch (error) {
        handleFirestoreError(error, editingExpense ? OperationType.UPDATE : OperationType.CREATE, path);
      }
    } else {
      // Guest local update
      if (editingExpense) {
        const updated = expenses.map((item) =>
          item.id === editingExpense.id
            ? { ...item, ...expenseData, updatedAt: new Date().toISOString() }
            : item
        );
        setExpenses(updated);
        localStorage.setItem('obra_facil_guest_expenses', JSON.stringify(updated));
        showNotice('Gasto atualizado localmente!');
      } else {
        const newExpense: Expense = {
          id: `guest_${Date.now()}`,
          ...expenseData,
          userId: 'guest',
          createdAt: new Date().toISOString(),
        };
        const updated = [newExpense, ...expenses];
        setExpenses(updated);
        localStorage.setItem('obra_facil_guest_expenses', JSON.stringify(updated));
        showNotice('Gasto adicionado localmente!');
      }
    }
  };

  // Delete Expense
  const handleDeleteExpense = async (id: string) => {
    const confirmDelete = window.confirm('Deseja realmente excluir este lançamento?');
    if (!confirmDelete) return;

    if (user) {
      const path = `users/${user.uid}/expenses/${id}`;
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'expenses', id));
        showNotice('Gasto removido do Firebase!');
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, path);
      }
    } else {
      const updated = expenses.filter((e) => e.id !== id);
      setExpenses(updated);
      localStorage.setItem('obra_facil_guest_expenses', JSON.stringify(updated));
      showNotice('Gasto removido.');
    }
  };

  // Calculate totals
  const materialTotal = expenses
    .filter((e) => e.category === 'material')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const laborTotal = expenses
    .filter((e) => e.category === 'mao_de_obra')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const grandTotal = materialTotal + laborTotal;

  // Category counts
  const materialCount = expenses.filter((e) => e.category === 'material').length;
  const laborCount = expenses.filter((e) => e.category === 'mao_de_obra').length;
  const totalCount = expenses.length;

  // Filtered expenses
  const filteredExpenses = expenses.filter((e) => {
    const matchesCategory =
      selectedCategory === 'todos' ||
      (selectedCategory === 'material' && e.category === 'material') ||
      (selectedCategory === 'mao_de_obra' && e.category === 'mao_de_obra');

    const matchesSearch =
      !searchTerm.trim() ||
      e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.date.includes(searchTerm);

    return matchesCategory && matchesSearch;
  });

  const handleUpdateProjectName = (name: string) => {
    setProjectName(name);
    localStorage.setItem('obra_facil_project_name', name);
    showNotice('Nome da obra atualizado!');
  };

  const handleUpdateBudgetLimit = (limit: number) => {
    setBudgetLimit(limit);
    localStorage.setItem('obra_facil_budget_limit', limit.toString());
    showNotice('Limite de orçamento atualizado!');
  };

  const handleRestoreSampleData = async () => {
    if (user) {
      await handleSeedToFirebase();
    } else {
      const sampleList: Expense[] = INITIAL_IMAGE_EXPENSES.map((item, idx) => ({
        ...item,
        id: `demo_${Date.now()}_${idx + 1}`,
        userId: 'guest',
        createdAt: new Date().toISOString(),
      }));
      setExpenses(sampleList);
      localStorage.setItem('obra_facil_guest_expenses', JSON.stringify(sampleList));
      showNotice('Gastos da imagem restaurados com sucesso!');
    }
  };

  const handleClearAllData = async () => {
    if (user) {
      setIsSyncing(true);
      try {
        for (const exp of expenses) {
          await deleteDoc(doc(db, 'users', user.uid, 'expenses', exp.id));
        }
        showNotice('Todos os gastos foram removidos do Firebase.');
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `users/${user.uid}/expenses`);
      } finally {
        setIsSyncing(false);
      }
    } else {
      setExpenses([]);
      localStorage.removeItem('obra_facil_guest_expenses');
      showNotice('Todos os gastos foram removidos.');
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Descrição', 'Categoria', 'Data', 'Valor (R$)'];
    const rows = filteredExpenses.map((e) => [
      `"${e.description.replace(/"/g, '""')}"`,
      e.category === 'mao_de_obra' ? 'Mão de Obra' : 'Material',
      e.date,
      e.amount.toFixed(2),
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `relatorio_obra_facil_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#f3f6f9] text-slate-800 flex flex-col font-sans selection:bg-amber-200">
      
      {/* Sticky Fixed Top Section (Header + Summary Cards + Histórico Toolbar) */}
      <div className="sticky top-0 z-30 bg-[#f3f6f9] border-b border-slate-200/90 shadow-2xs">
        {/* Header component */}
        <Header
          user={user}
          isFirebaseConnected={isFirebaseConnected}
          onSignIn={handleSignIn}
          onSignOut={handleSignOut}
          isSyncing={isSyncing}
          onOpenSidebar={() => setIsSidebarOpen(true)}
        />

        {/* Top Summary Cards and Histórico Toolbar pinned to top */}
        <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 pt-1.5 pb-2.5 bg-[#f3f6f9]">
          {/* Summary Cards: Material, Mão de Obra, Total */}
          <SummaryCards
            materialTotal={materialTotal}
            laborTotal={laborTotal}
            grandTotal={grandTotal}
          />

          {/* Subheader: Quick search input and Category Filter with count */}
          <div className="flex items-center justify-between gap-3 pt-1">
            
            {/* Quick search input */}
            <div className="relative flex-1 max-w-xs">
              <input
                type="text"
                placeholder="Buscar lançamento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs transition-all"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Filter select dropdown showing count next to Todos */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm font-bold py-1.5 pl-3.5 pr-8 rounded-xl shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="todos">Todos ({totalCount})</option>
                  <option value="material">Material ({materialCount})</option>
                  <option value="mao_de_obra">Mão de Obra ({laborCount})</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Scrollable Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-4 pb-24">
        
        {/* Floating Notification Toast */}
        {feedbackNotice && (
          <div className="fixed top-24 right-4 z-50 bg-slate-900 text-amber-300 border border-slate-700 shadow-xl rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in slide-in-from-top-4 duration-200">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{feedbackNotice}</span>
          </div>
        )}

        {/* User Authenticated with Empty Collection Banner */}
        {user && expenses.length === 0 && !isSyncing && (
          <div className="mb-4 bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-amber-600 shrink-0" />
              <div>
                <h4 className="text-sm font-bold">Seu banco de dados do Firebase está pronto!</h4>
                <p className="text-xs text-amber-800">
                  Deseja carregar os 10 gastos exatos da imagem para começar ou lançar seus próprios gastos?
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSeedToFirebase}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-xs"
              >
                Carregar Dados da Imagem
              </button>
              <button
                onClick={() => {
                  setEditingExpense(null);
                  setIsModalOpen(true);
                }}
                className="bg-white border border-amber-300 text-amber-900 text-xs font-bold px-3.5 py-2 rounded-xl transition-all hover:bg-amber-100 cursor-pointer"
              >
                + Lançar Novo Gasto
              </button>
            </div>
          </div>
        )}

        {/* Expenses List */}
        <div className="space-y-3">
          {filteredExpenses.length > 0 ? (
            filteredExpenses.map((expense) => (
              <ExpenseItem
                key={expense.id}
                expense={expense}
                onEdit={(exp) => {
                  setEditingExpense(exp);
                  setIsModalOpen(true);
                }}
                onDelete={handleDeleteExpense}
                onViewReceipt={(url, desc) => setActiveReceipt({ url, desc })}
              />
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-300 p-6">
              <span className="text-3xl block mb-2">📋</span>
              <h3 className="font-extrabold text-slate-700 text-base">
                Nenhum gasto encontrado
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                {searchTerm
                  ? `Nenhum resultado para "${searchTerm}". Tente outro termo.`
                  : 'Comece adicionando seu primeiro lançamento de material ou mão de obra.'}
              </p>
              <button
                onClick={() => {
                  setEditingExpense(null);
                  setIsModalOpen(true);
                }}
                className="mt-4 inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Lançar Novo Gasto</span>
              </button>
            </div>
          )}
        </div>

      </main>

      {/* Floating Action Button on Bottom-Right */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => {
            setEditingExpense(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-[#f59e0b] hover:bg-[#d97706] text-slate-950 font-black px-5 py-3.5 rounded-full shadow-xl hover:shadow-2xl transition-all active:scale-95 cursor-pointer border-2 border-amber-300 group"
        >
          <Plus className="w-5 h-5 stroke-[3] group-hover:rotate-90 transition-transform" />
          <span className="text-sm font-extrabold tracking-tight">Lançar Novo Gasto</span>
        </button>
      </div>

      {/* Expense Modal (Create & Edit) matching image 2 */}
      <ExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveExpense}
        editingExpense={editingExpense}
      />

      {/* Full-view Receipt Lightbox Modal */}
      <ReceiptViewerModal
        isOpen={!!activeReceipt}
        onClose={() => setActiveReceipt(null)}
        receiptUrl={activeReceipt?.url || null}
        description={activeReceipt?.desc || ''}
      />

      {/* Side Menu Drawer (Configurações & Sincronização) matching image */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        user={user}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        onRestoreSampleData={handleRestoreSampleData}
        onClearAllData={handleClearAllData}
        onExportCSV={handleExportCSV}
        grandTotal={grandTotal}
        totalExpensesCount={expenses.length}
        projectName={projectName}
        onUpdateProjectName={handleUpdateProjectName}
        budgetLimit={budgetLimit}
        onUpdateBudgetLimit={handleUpdateBudgetLimit}
      />

    </div>
  );
}
