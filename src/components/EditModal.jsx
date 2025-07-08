import { useState, useEffect } from 'react';

export default function EditModal({ transaction, onSave, onClose }) {
  const [form, setForm] = useState({
    type: 'receita',
    description: '',
    value: '',
    category: 'Outro',
    date: '',
  });

  // Lista de categorias baseadas no tipo
  const getCategoriasFiltradas = (tipo) => {
    if (tipo === 'receita') return ['Salário', 'Trabalho', 'Outro'];
    if (tipo === 'despesa') return ['Alimentação', 'Transporte', 'Outro'];
    return ['Outro'];
  };

  useEffect(() => {
    if (transaction) {
      const data = transaction.date?.seconds
        ? new Date(transaction.date.seconds * 1000)
        : new Date(transaction.date);

      const dateStr = data.toISOString().slice(0, 16); // formato yyyy-MM-ddTHH:mm

      setForm({
        type: transaction.type || 'receita',
        description: transaction.description || '',
        value: transaction.value || '',
        category: transaction.category || 'Outro',
        date: dateStr,
      });
    }
  }, [transaction]);

  if (!transaction) return null;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...transaction,
      ...form,
      value: parseFloat(form.value) || 0,
      date: form.date ? new Date(form.date) : transaction.date,
    });
  };

  const categoriasFiltradas = getCategoriasFiltradas(form.type);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="bg-white rounded-2xl p-6 w-80 max-w-full shadow-lg pointer-events-auto">
        <h2 className="text-xl font-bold mb-4">Editar Transação</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full rounded border p-2"
          >
            <option value="receita">Receita</option>
            <option value="despesa">Despesa</option>
          </select>

          <input
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Descrição"
            className="w-full rounded border p-2"
            required
          />

          <input
            name="value"
            value={form.value}
            onChange={handleChange}
            placeholder="Valor"
            type="number"
            step="0.01"
            className="w-full rounded border p-2"
            required
          />

          <input
            name="date"
            value={form.date}
            onChange={handleChange}
            type="datetime-local"
            className="w-full rounded border p-2"
            required
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full rounded border p-2"
          >
            {categoriasFiltradas.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

