import { useState, useEffect } from 'react';

export default function AddModal({ onAdd, onClose, categories }) {
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [type, setType] = useState('receita');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [success, setSuccess] = useState(false);

  // Define as categorias conforme o tipo
  const categoriasFiltradas = categories.filter((cat) => {
    if (cat === 'todas') return false;

    if (type === 'receita') {
      return ['Salário', 'Trabalho', 'Outro'].includes(cat);
    }

    if (type === 'despesa') {
      return ['Alimentação', 'Transporte', 'Outro'].includes(cat);
    }

    return false;
  });

  // Atualiza categoria padrão sempre que o tipo mudar
  useEffect(() => {
    setCategory(categoriasFiltradas[0] || '');
  }, [type, categories]);

  const formatCurrency = (val) => {
    const num = val.replace(/\D/g, '');
    return (Number(num) / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const handleValueChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    setValue(formatCurrency(raw));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const numericValue = Number(value.replace(/[^\d,-]/g, '').replace(',', '.'));

    if (!description || isNaN(numericValue) || numericValue <= 0) return;

    const transaction = {
      description,
      value: numericValue,
      type,
      category,
      date: date ? new Date(date) : new Date(),
    };

    onAdd(transaction);
    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fadeIn">
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
        type="text"
        placeholder="Valor"
        value={value}
        onChange={handleValueChange}
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
        {categoriasFiltradas.length > 0 ? (
          categoriasFiltradas.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))
        ) : (
          <option disabled>Nenhuma categoria disponível</option>
        )}
      </select>

      <input
        type="datetime-local"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full border rounded-lg px-4 py-2"
      />

      {success && (
        <div className="text-green-600 text-center font-semibold">
          ✅ Transação salva com sucesso!
        </div>
      )}

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
