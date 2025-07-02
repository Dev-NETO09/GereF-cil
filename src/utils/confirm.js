import Swal from 'sweetalert2';

export async function confirmarAcao(mensagem = 'Tem certeza que deseja continuar?') {
  const resultado = await Swal.fire({
    title: 'Confirmar ação',
    text: mensagem,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sim',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
  });

  return resultado.isConfirmed;
}
