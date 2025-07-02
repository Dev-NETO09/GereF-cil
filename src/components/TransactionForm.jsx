import { useState } from 'react';
import { serverTimestamp } from 'firebase/firestore';

export default function TransactionForm({ onAdd }) {
  const [form, setForm] = useState({
    type: 'receita',
    description: '',
    value: '',
    category: 'Outro',
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.description || !form.value) {
      alert('Por favor preencha descrição e valor.');
      return;
    }

    onAdd({
      ...form,
      value: Number(form.value),
      date: serverTimestamp(), // pega a hora do firebase
    });

    setForm({
      type: 'receita',
      description: '',
      value: '',
      category: 'Outro',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-3">
      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        className="rounded-xl border p-2 w-full"
      >
        <option value="receita">Receita</option>
        <option value="despesa">Despesa</option>
      </select>

      <input
        name="description"
        placeholder="Descrição"
        value={form.description}
        onChange={handleChange}
        className="rounded-xl border p-2 w-full"
        required
      />

      <input
        name="value"
        placeholder="Valor"
        type="number"
        step="0.01"
        value={form.value}
        onChange={handleChange}
        className="rounded-xl border p-2 w-full"
        required
      />

      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        className="rounded-xl border p-2 w-full"
      >
        <option>Outros</option>
        <option>Alimentação</option>
        <option>Transporte</option>
        <option>Salário</option>
        <option>Trabalho</option>
      </select>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white rounded-xl py-2 hover:bg-blue-700 transition"
      >
        Adicionar
      </button>
    </form>
  );
}
