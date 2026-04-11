import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { closeDrawers, toggleCart, toggleMobileNav, toggleTheme } from "../../features/uiSlice.js";
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
  const navigate = useNavigate();
  const theme = useSelector((state) => state.ui.theme);
  const mobileNavOpen = useSelector((state) => state.ui.mobileNavOpen);
  const cartSummary = useSelector(selectCartSummary);

  const handleSectionNavigation = (sectionId) => {
    dispatch(closeDrawers());

    if (location.pathname !== "/") {
      navigate(`/#${sectionId}`);
      return;
    }

    const element = document.getElementById(sectionId);

    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 104;
      window.scrollTo({ top: y, behavior: "smooth" });
      window.history.replaceState({}, "", sectionId === "home" ? "/" : `/#${sectionId}`);
      return;
    }

    navigate(`/#${sectionId}`);
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
            <span>{theme === "sand" ? "Night" : "Light"}</span>
          </button>
          <button className="badge-button strong icon-badge-button" type="button" onClick={() => dispatch(toggleCart())}>
            <Icon name="cart" />
            <span>{cartSummary.quantity}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
