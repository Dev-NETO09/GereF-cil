import { useState, useEffect } from 'react';

export default function EditModal({ transaction, onSave, onClose }) {
  const [form, setForm] = useState({
    type: 'receita',
    description: '',
    value: '',
    category: 'Outro',
    date: '',
  });

  const getCategoriasFiltradas = (tipo) => {
    if (tipo === 'receita') return ['Salário', 'Trabalho', 'Outro'];
    if (tipo === 'despesa') return ['Alimentação', 'Transporte', 'Outro'];
    return ['Outro'];
  };

  useEffect(() => {
    if (transaction) {
      let dateObj;

      if (transaction.date?.seconds) {
        dateObj = new Date(transaction.date.seconds * 1000);
      } else {
        dateObj = new Date(transaction.date);
      }

      // Converte para yyyy-MM-ddTHH:mm no horário LOCAL
      const pad = (n) => String(n).padStart(2, '0');
      const localStr = `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(dateObj.getDate())}T${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}`;

      setForm({
        type: transaction.type || 'receita',
        description: transaction.description || '',
        value: transaction.value || '',
        category: transaction.category || 'Outro',
        date: localStr,
      });
    }
  }, [transaction]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave({
      ...transaction,
      ...form,
      value: parseFloat(form.value) || 0,
      date: new Date(form.date),
    });
  };

  const categoriasFiltradas = getCategoriasFiltradas(form.type);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fadeIn">
      <h2 className="text-2xl font-bold text-center text-indigo-700">Editar Transação</h2>

      <input
        type="text"
        name="description"
        placeholder="Descrição"
        value={form.description}
        onChange={handleChange}
        className="w-full border rounded-lg px-4 py-2"
        required
      />

      <input
        type="number"
        step="0.01"
        name="value"
        placeholder="Valor"
        value={form.value}
        onChange={handleChange}
        className="w-full border rounded-lg px-4 py-2"
        required
      />

      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        className="w-full border rounded-lg px-4 py-2"
      >
        <option value="receita">Receita</option>
        <option value="despesa">Despesa</option>
      </select>

      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        className="w-full border rounded-lg px-4 py-2"
      >
        {categoriasFiltradas.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <div className="relative w-full">
        {!form.date && (
          <span className="absolute top-2.5 left-4 text-gray-400 pointer-events-none text-sm">
            Data e hora
          </span>
        )}
        <input
          type="datetime-local"
          name="date"
          value={form.date}
          onChange={handleChange}
          className={`appearance-none w-full border rounded-lg px-4 py-2 pl-4 pr-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${!form.date ? 'text-gray-400' : 'text-black'}`}
          required
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          Salvar
        </button>
      </div>
    </form>
  );
}

