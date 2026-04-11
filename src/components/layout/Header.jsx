import { Link, NavLink, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { closeDrawers, toggleMobileNav, toggleTheme } from "../../features/uiSlice.js";
import { selectCartSummary } from "../../utils/productFilters.js";
import { brand } from "../../data/brand.js";
import Icon from "../ui/Icon.jsx";

const homeLinks = [
  { label: "Accueil", id: "home" },
  { label: "About", id: "about" },
  { label: "Nouveautes", id: "new-arrivals" },
  { label: "Contact", id: "contact" }
];

function Header() {
  const dispatch = useDispatch();
  const location = useLocation();
  const theme = useSelector((state) => state.ui.theme);
  const mobileNavOpen = useSelector((state) => state.ui.mobileNavOpen);
  const cartSummary = useSelector(selectCartSummary);

  const handleSectionNavigation = (sectionId) => {
    dispatch(closeDrawers());

    if (sectionId === "home") {
      if (location.pathname !== "/") {
        window.location.assign("/");
        return;
      }

      window.history.replaceState({}, "", "/");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (location.pathname !== "/") {
      window.location.assign(`/#${sectionId}`);
      return;
    }

    const element = document.getElementById(sectionId);

    if (!element) {
      window.location.assign(`/#${sectionId}`);
      return;
    }

    window.history.replaceState({}, "", `/#${sectionId}`);
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <NavLink className="brand-lockup logo-only" to="/" aria-label={`${brand.name} home`}>
          <img src="/logo-padelna.svg" alt={`${brand.name} logo`} />
        </NavLink>

        <button
          className="mobile-nav-toggle"
          type="button"
          aria-expanded={mobileNavOpen}
          aria-label="Ouvrir le menu"
          onClick={() => dispatch(toggleMobileNav())}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`header-nav ${mobileNavOpen ? "open" : ""}`} aria-label="Navigation principale">
          {homeLinks.map((link) => (
            <button key={link.id} type="button" onClick={() => handleSectionNavigation(link.id)}>
              {link.label}
            </button>
          ))}
          <NavLink
            to="/store"
            onClick={() => dispatch(closeDrawers())}
            className={({ isActive }) => (isActive ? "active nav-store-link" : "nav-store-link")}
          >
            Boutique
          </NavLink>
        </nav>

        <div className="header-actions">
          <button className="theme-button" type="button" onClick={() => dispatch(toggleTheme())}>
            <Icon name={theme === "sand" ? "moon" : "sun"} />
            <span>{theme === "sand" ? "Mode nuit" : "Mode clair"}</span>
          </button>
          <Link className="badge-button strong icon-badge-button" to="/cart" onClick={() => dispatch(closeDrawers())}>
            <Icon name="cart" />
            <span>{cartSummary.quantity}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
