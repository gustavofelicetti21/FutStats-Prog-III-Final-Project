const labels = {
  active: 'Ativo',
  deactivated: 'Inativo',
  draft: 'Rascunho',
  finished: 'Finalizado',
  scheduled: 'Agendado',
  cancelled: 'Cancelado',
};

function StatusBadge({ status }) {
  return <span className={`status-badge status-${status}`}>{labels[status] || status}</span>;
}

export default StatusBadge;
