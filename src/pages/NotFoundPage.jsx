import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getSiteCopy } from "../data/siteContent.js";
import Icon from "../components/ui/Icon.jsx";

function NotFoundPage() {
  const language = useSelector((state) => state.ui.language);
  const copy = getSiteCopy(language);

  return (
    <section className="section not-found">
      <p className="eyebrow">404</p>
      <h1>{copy.notFound.title}</h1>
      <p>{copy.notFound.copy}</p>
      <div className="hero-actions">
        <Link to="/" className="ghost-button">
          <Icon name="home" />
          {copy.notFound.home}
        </Link>
        <Link to="/store" className="primary-button">
          <Icon name="shop" />
          {copy.notFound.store}
        </Link>
      </div>
    </section>
  );
}

export default NotFoundPage;
