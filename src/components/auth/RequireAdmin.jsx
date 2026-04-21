import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingBall from "../ui/LoadingBall.jsx";
import { getSiteCopy } from "../../data/siteContent.js";

function RequireAdmin({ children }) {
  const location = useLocation();
  const language = useSelector((state) => state.ui.language);
  const copy = getSiteCopy(language);
  const { user, sessionChecked, sessionStatus } = useSelector((state) => state.auth);

  if (!sessionChecked || sessionStatus === "loading") {
    return <LoadingBall label={copy.auth.loadingSession} variant="page" />;
  }

  if (!user) {
    const redirect = `${location.pathname}${location.search}`;
    return <Navigate to={`/login?redirect=${encodeURIComponent(redirect)}`} replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/account" replace />;
  }

  return children;
}

export default RequireAdmin;
