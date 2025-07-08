import { useEffect, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import TransactionList from './components/TransactionList';
import EditModal from './components/EditModal';
import AddModal from './components/AddModal';
import { db } from './firebaseConfig';

import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState('todos');
  const [filterCategory, setFilterCategory] = useState('todas');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchTransactions = async () => {
    const querySnapshot = await getDocs(collection(db, 'transactions'));
    const data = querySnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .sort((a, b) => {
        const dateA = a.date?.seconds || 0;
        const dateB = b.date?.seconds || 0;
        return dateB - dateA;
      });
    setTransactions(data);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const addTransaction = async (transaction) => {
    await addDoc(collection(db, 'transactions'), transaction);
    fetchTransactions();
  };

  const deleteTransaction = async (id) => {
    await deleteDoc(doc(db, 'transactions', id));
    fetchTransactions();
  };

  const editTransaction = async (transaction) => {
    const { id, ...data } = transaction;
    await updateDoc(doc(db, 'transactions', id), data);
    setEditingTransaction(null);
    fetchTransactions();
  };

  const openEditModal = (transaction) => {
    setEditingTransaction(transaction);
  };

  const closeEditModal = () => {
    setEditingTransaction(null);
  };

  const clearDateFilter = () => {
    setStartDate('');
    setEndDate('');
  };

  const categories = ['todas', 'Alimentação', 'Transporte', 'Salário', 'Trabalho', 'Outro'];

  const filteredTransactions = transactions.filter((t) => {
    const date = t.date?.seconds ? new Date(t.date.seconds * 1000) : null;

    const matchType = filterType === 'todos' || t.type === filterType;
    const matchCategory = filterCategory === 'todas' || t.category === filterCategory;
    const matchStartDate = !startDate || (date && date >= new Date(startDate + 'T00:00:00'));
    const matchEndDate = !endDate || (date && date <= new Date(endDate + 'T23:59:59'));

    return matchType && matchCategory && matchStartDate && matchEndDate;
  });

  // TOTAL GERAL (fixo, não muda com filtros)
  const totalIncome = transactions
    .filter((t) => t.type === 'receita')
    .reduce((acc, t) => acc + Number(t.value), 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'despesa')
    .reduce((acc, t) => acc + Number(t.value), 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />

      <main className="flex-grow bg-gray-100 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-6 sm:p-8">
          <h1 className="text-4xl font-bold text-center text-indigo-800 mb-6">Dashboard Financeiro</h1>

          {/* Cards superiores com totais fixos */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-200/50 border border-green-400 p-4 rounded-3xl shadow hover:scale-105 transition">
              <h2 className="text-sm text-green-700 font-semibold">Receitas</h2>
              <p className="text-2xl font-bold text-green-900">R$ {totalIncome.toFixed(2)}</p>
            </div>
            <div className="bg-red-200/50 border border-red-400 p-4 rounded-3xl shadow hover:scale-105 transition">
              <h2 className="text-sm text-red-700 font-semibold">Despesas</h2>
              <p className="text-2xl font-bold text-red-900">R$ {totalExpense.toFixed(2)}</p>
            </div>
            <div className="bg-indigo-200/50 border border-indigo-400 p-4 rounded-3xl shadow hover:scale-105 transition">
              <h2 className="text-sm text-indigo-700 font-semibold">Saldo Atual</h2>
              <p className="text-2xl font-bold text-indigo-900">R$ {balance.toFixed(2)}</p>
            </div>
          </div>

          {/* Botão para mostrar/ocultar filtros */}
          <div className="mb-6">
            <button
              onClick={() => setMostrarFiltros((prev) => !prev)}
              className="bg-indigo-600 text-white px-6 py-2 rounded-full shadow hover:bg-indigo-700 transition"
            >
              {mostrarFiltros ? 'Ocultar Filtros' : '🔍 Filtros'}
            </button>

            {/* Filtros ativos */}
            {mostrarFiltros && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                {/* Filtro tipo */}
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="rounded-full border border-gray-300 p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                >
                  <option value="todos">Todos os Tipos</option>
                  <option value="receita">Somente Receitas</option>
                  <option value="despesa">Somente Despesas</option>
                </select>

                {/* Filtro categoria */}
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="rounded-full border border-gray-300 p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === 'todas' ? 'Todas Categorias' : cat}
                    </option>
                  ))}
                </select>

                {/* Filtro data */}
                <div className="flex flex-col gap-2 bg-gray-50 border border-gray-300 p-3 rounded-2xl shadow-sm">
                  <span className="text-sm text-gray-700 font-semibold">Período:</span>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="rounded-full border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                    />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="rounded-full border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                    />
                  </div>

                  {(startDate || endDate) && (
                    <button
                      onClick={clearDateFilter}
                      className="text-xs text-red-600 hover:underline self-start mt-1"
                    >
                      ✖ Limpar período
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Lista de transações filtradas */}
          <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-800">📋 Histórico de Transações</h2>
          <TransactionList
            transactions={filteredTransactions}
            onDelete={deleteTransaction}
            onEdit={openEditModal}
          />

          {/* MODAL DE EDIÇÃO */}
          {editingTransaction && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
              <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-lg">
                <EditModal
                  transaction={editingTransaction}
                  onSave={editTransaction}
                  onClose={closeEditModal}
                />
              </div>
            </div>
          )}

          {/* MODAL DE ADIÇÃO */}
          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
              <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-lg">
                <AddModal
                  onAdd={addTransaction}
                  onClose={() => setShowAddModal(false)}
                  categories={categories}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* BOTÃO ADICIONAR */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-6 right-6 bg-indigo-600 text-white text-3xl w-14 h-14 rounded-full shadow-lg hover:bg-indigo-700 transition-all"
      >
        +
      </button>

      <Footer />
    </div>
  );
}

