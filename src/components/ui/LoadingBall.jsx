function LoadingBall({ label = "Chargement...", variant = "page" }) {
  return (
    <div className={`loading-ball loading-ball-${variant}`} role="status" aria-live="polite">
      <div className="loading-ball-visual" aria-hidden="true">
        <span className="loading-ball-orbit" />
        <span className="loading-ball-core">
          <span className="loading-ball-stripe loading-ball-stripe-left" />
          <span className="loading-ball-stripe loading-ball-stripe-right" />
        </span>
      </div>
      {label ? <p>{label}</p> : null}
    </div>
  );
}

export default LoadingBall;
