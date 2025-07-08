import { confirmarAcao } from '../utils/confirm';

export default function TransactionList({ transactions, onDelete, onEdit }) {
  if (transactions.length === 0) {
    return <p className="text-gray-500 text-center">Nenhuma transação cadastrada.</p>;
  }

  const confirmarExclusao = async (id) => {
    const confirmado = await confirmarAcao('Tem certeza que deseja excluir esta transação?');
    if (confirmado) {
      onDelete(id);
    }
  };

  return (
    <div className="space-y-3">
      {transactions.map((tx) => (
        <div
          key={tx.id}
          className={`flex justify-between items-center p-3 rounded-2xl shadow-sm border ${
            tx.type === 'receita' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          }`}
        >
          <div className="flex-1">
            <p className="font-semibold text-gray-800">{tx.description}</p>
            <p className="text-sm text-gray-600">
              R$ {Number(tx.value).toFixed(2)} &bull; {tx.category} &bull;{' '}
              {tx.date
                ? new Date(tx.date.seconds * 1000).toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Sem data'}
            </p>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={() => onEdit(tx)}
              className="text-sm text-blue-600 hover:underline"
            >
              Editar
            </button>
            <button
              onClick={() => confirmarExclusao(tx.id)}
              className="text-sm text-red-600 hover:underline"
            >
              Excluir
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
