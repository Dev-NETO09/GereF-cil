import { useState } from 'react';

export default function AddModal({ onAdd, onClose, categories }) {
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [type, setType] = useState('receita');
  const [category, setCategory] = useState(categories[0] || '');
  const [date, setDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !value || !date) return;

    const transaction = {
      description,
      value: parseFloat(value),
      type,
      category,
      date: new Date(date),
    };

    onAdd(transaction);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold text-center text-indigo-700">Adicionar Transação</h2>

      <input
        type="text"
        placeholder="Descrição"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border rounded-lg px-4 py-2"
        required
      />

      <input
        type="number"
        placeholder="Valor"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full border rounded-lg px-4 py-2"
        required
      />

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="w-full border rounded-lg px-4 py-2"
      >
        <option value="receita">Receita</option>
        <option value="despesa">Despesa</option>
      </select>

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full border rounded-lg px-4 py-2"
      >
        {categories
          .filter((cat) => cat !== 'todas') // evita 'todas' como opção de cadastro
          .map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
      </select>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full border rounded-lg px-4 py-2"
      />

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
          Adicionar
        </button>
      </div>
    </form>
  );
}
