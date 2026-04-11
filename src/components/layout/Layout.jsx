import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import FavoritesDrawer from "./FavoritesDrawer.jsx";
import FloatingFavoritesButton from "./FloatingFavoritesButton.jsx";
import Toast from "./Toast.jsx";
import { closeDrawers, hideToast } from "../../features/uiSlice.js";

const scrollToHashTarget = (hash) => {
  const id = hash.replace("#", "");
  const element = document.getElementById(id);

  if (!element) {
    return false;
  }

  element.scrollIntoView({ behavior: "smooth", block: "start" });
  return true;
};

function Layout() {
  const dispatch = useDispatch();
  const location = useLocation();
  const theme = useSelector((state) => state.ui.theme);
  const toast = useSelector((state) => state.ui.toast);

  useEffect(() => {
    document.documentElement.style.colorScheme = theme === "sand" ? "light" : "dark";
    document.body.style.background = theme === "sand" ? "#f3eddf" : "#07121f";
  }, [theme]);

  useEffect(() => {
    dispatch(closeDrawers());

    if (location.hash) {
      let attempts = 0;
      let frameId = 0;

      const tryScroll = () => {
        const found = scrollToHashTarget(location.hash);

        if (!found && attempts < 90) {
          attempts += 1;
          frameId = window.requestAnimationFrame(tryScroll);
        }
      };

      frameId = window.requestAnimationFrame(tryScroll);

      return () => window.cancelAnimationFrame(frameId);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
    return undefined;
  }, [dispatch, location.pathname, location.hash]);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timer = window.setTimeout(() => dispatch(hideToast()), 3200);
    return () => window.clearTimeout(timer);
  }, [dispatch, toast]);

  return (
    <div className={`site theme-${theme}`}>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <Header />
      <FavoritesDrawer />
      <FloatingFavoritesButton />
      <main className="page-shell">
        <Outlet />
      </main>
      <Footer />
      {toast ? <Toast toast={toast} onClose={() => dispatch(hideToast())} /> : null}
    </div>
  );
}

export default Layout;
