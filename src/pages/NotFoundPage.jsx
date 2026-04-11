import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <section className="section not-found">
      <p className="eyebrow">404</p>
      <h1>Cette page n'existe pas encore.</h1>
      <p>Retournez a l'accueil Padelna ou ouvrez directement la boutique.</p>
      <div className="hero-actions">
        <Link to="/" className="ghost-button">
          Accueil
        </Link>
        <Link to="/store" className="primary-button">
          Boutique
        </Link>
      </div>
    </section>
  );
}

export default NotFoundPage;
