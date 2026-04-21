import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { closeDrawers, setLanguage, toggleMobileNav } from "../../features/uiSlice.js";
import { selectCartSummary } from "../../utils/productFilters.js";
import { getBrandContent } from "../../data/brand.js";
import { getSiteCopy } from "../../data/siteContent.js";
import Icon from "../ui/Icon.jsx";
import ProfileAvatar from "../ui/ProfileAvatar.jsx";

function Header() {
  const dispatch = useDispatch();
  const location = useLocation();
  const language = useSelector((state) => state.ui.language);
  const user = useSelector((state) => state.auth.user);
  const mobileNavOpen = useSelector((state) => state.ui.mobileNavOpen);
  const cartSummary = useSelector(selectCartSummary);
  const [isScrolled, setIsScrolled] = useState(false);
  const brand = getBrandContent(language);
  const copy = getSiteCopy(language);
  const isAdmin = user?.role === "admin";
  const userLabel = user ? user.firstName || user.fullName || copy.header.account : copy.header.signIn;
  const homeLinks = [
    { label: copy.header.home, id: "home", icon: "home" },
    // About is temporarily hidden while the section is not displayed on the home page.
    { label: copy.header.newArrivals, id: "new-arrivals", icon: "spark" },
    { label: copy.header.contact, id: "contact", icon: "mail" }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 18);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <header className={`site-header ${isScrolled ? "scrolled" : ""}`}>
      <div className="header-inner">
        <NavLink className="brand-lockup logo-only" to="/" aria-label={`${brand.name} ${copy.header.home}`}>
          <img src="/logo-padelna.svg" alt={`${brand.name} logo`} />
        </NavLink>

        <button
          className="mobile-nav-toggle"
          type="button"
          aria-expanded={mobileNavOpen}
          aria-label={copy.header.openMenu}
          onClick={() => dispatch(toggleMobileNav())}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`header-nav ${mobileNavOpen ? "open" : ""}`} aria-label={copy.header.primaryNav}>
          {homeLinks.map((link) => (
            <button key={link.id} type="button" onClick={() => handleSectionNavigation(link.id)}>
              <Icon name={link.icon} />
              <span>{link.label}</span>
            </button>
          ))}
          <NavLink
            to="/store"
            onClick={() => dispatch(closeDrawers())}
            className={({ isActive }) => (isActive ? "active nav-store-link" : "nav-store-link")}
          >
            <Icon name="shop" />
            <span>{copy.header.store}</span>
          </NavLink>
        </nav>

        <div className="header-actions">
          <div className="language-toggle" aria-label={copy.header.language}>
            <button
              type="button"
              className={language === "en" ? "active" : ""}
              aria-pressed={language === "en"}
              onClick={() => dispatch(setLanguage("en"))}
            >
              EN
            </button>
            <button
              type="button"
              className={language === "fr" ? "active" : ""}
              aria-pressed={language === "fr"}
              onClick={() => dispatch(setLanguage("fr"))}
            >
              FR
            </button>
          </div>
          {isAdmin ? (
            <>
              <Link
                className="badge-button strong icon-badge-button user-entry-button"
                to="/admin"
                onClick={() => dispatch(closeDrawers())}
                aria-label={copy.header.admin}
              >
                <Icon name="shield" />
                <span>{copy.header.admin}</span>
              </Link>
              <Link
                className="badge-button strong icon-badge-button user-entry-button"
                to="/account"
                onClick={() => dispatch(closeDrawers())}
                aria-label={copy.header.account}
              >
                <ProfileAvatar avatarUrl={user?.avatarUrl} gender={user?.gender} name={userLabel} className="header-profile-avatar" />
                <span className="button-label">{userLabel}</span>
              </Link>
            </>
          ) : (
            <Link
              className="badge-button strong icon-badge-button user-entry-button"
              to={user ? "/account" : "/login"}
              onClick={() => dispatch(closeDrawers())}
              aria-label={user ? copy.header.account : copy.header.signIn}
            >
              <ProfileAvatar avatarUrl={user?.avatarUrl} gender={user?.gender} name={userLabel} className="header-profile-avatar" />
              <span className="button-label">{userLabel}</span>
            </Link>
          )}
          <Link className="badge-button strong icon-badge-button" to="/cart" onClick={() => dispatch(closeDrawers())}>
            <Icon name="cart" />
            <span className="counter-badge">{cartSummary.quantity}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
