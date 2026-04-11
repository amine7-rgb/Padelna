import { Link } from "react-router-dom";
import Icon from "../components/ui/Icon.jsx";

function NotFoundPage() {
  return (
    <section className="section not-found">
      <p className="eyebrow">404</p>
      <h1>This page does not exist yet.</h1>
      <p>Go back to the Padelna home page or jump straight into the store.</p>
      <div className="hero-actions">
        <Link to="/" className="ghost-button">
          <Icon name="home" />
          Home
        </Link>
        <Link to="/store" className="primary-button">
          <Icon name="shop" />
          Store
        </Link>
      </div>
    </section>
  );
}

export default NotFoundPage;
