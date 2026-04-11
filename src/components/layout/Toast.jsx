function Toast({ toast, onClose }) {
  return (
    <div className={`toast ${toast.type || "info"}`} role="status" aria-live="polite">
      <div className="toast-badge" />
      <p>{toast.message}</p>
      <button type="button" onClick={onClose}>
        x
      </button>
    </div>
  );
}

export default Toast;
