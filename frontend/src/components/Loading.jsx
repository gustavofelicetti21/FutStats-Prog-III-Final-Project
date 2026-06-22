function Loading({ label = 'Carregando...' }) {
  return (
    <div aria-live="polite" className="loading-state" role="status">
      <span className="spinner" />
      {label}
    </div>
  );
}

export default Loading;
