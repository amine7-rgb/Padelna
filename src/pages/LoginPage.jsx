import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Reveal from "../components/sections/Reveal.jsx";
import SectionTitle from "../components/sections/SectionTitle.jsx";
import Icon from "../components/ui/Icon.jsx";
import LoadingBall from "../components/ui/LoadingBall.jsx";
import { getBrandContent } from "../data/brand.js";
import { getSiteCopy } from "../data/siteContent.js";
import { loginUser } from "../features/authSlice.js";
import { showToast } from "../features/uiSlice.js";
import { api } from "../services/api.js";

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const language = useSelector((state) => state.ui.language);
  const copy = getSiteCopy(language);
  const brand = getBrandContent(language);
  const { user, providers, actionStatus, sessionChecked } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: "", password: "" });
  const redirect = searchParams.get("redirect") || "/account";
  const showcaseImage = brand.heroSlides?.[1]?.image || "/brand-media/hero-2.png";
  const oauthFeedback = useMemo(() => {
    const oauthStatus = searchParams.get("oauth");

    if (oauthStatus === "google-disabled") {
      return copy.auth.googleUnavailableTitle;
    }

    if (oauthStatus === "facebook-disabled") {
      return copy.auth.socialUnavailable;
    }

    if (oauthStatus) {
      return copy.auth.oauthError;
    }

    return "";
  }, [copy.auth.googleUnavailableTitle, copy.auth.oauthError, copy.auth.socialUnavailable, searchParams]);

  useEffect(() => {
    if (user) {
      navigate(redirect, { replace: true });
    }
  }, [navigate, redirect, user]);

  useEffect(() => {
    if (oauthFeedback) {
      dispatch(showToast({ type: "error", message: oauthFeedback }));
    }
  }, [dispatch, oauthFeedback]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await dispatch(loginUser(form)).unwrap();
      navigate(redirect, { replace: true });
    } catch (error) {
      dispatch(showToast({ type: "error", message: error.message }));
    }
  };

  if (!sessionChecked && actionStatus === "idle") {
    return <LoadingBall label={copy.auth.loadingSession} variant="page" />;
  }

  return (
    <div className="auth-page">
      <section className="section auth-layout">
        <Reveal className="auth-card auth-card-main auth-premium-main">
          <div className="auth-intro-stack">
            <SectionTitle eyebrow={copy.auth.loginEyebrow} title={copy.auth.loginTitle} copy={copy.auth.loginCopy} />

            <div className="auth-highlight-row">
              {copy.auth.loginHighlights?.map((item) => (
                <span key={item} className="auth-highlight-pill">
                  <Icon name="spark" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="auth-social-stack">
            <span className="auth-social-kicker">{copy.auth.orContinue}</span>
            {providers.google ? (
              <a className="primary-button auth-google-button" href={api.getOAuthUrl("google", redirect)}>
                <Icon name="google" />
                {copy.auth.google}
              </a>
            ) : (
              <div className="auth-provider-unavailable">
                <div className="auth-provider-copy">
                  <strong>{copy.auth.googleUnavailableTitle}</strong>
                  <p>{copy.auth.googleUnavailableCopy}</p>
                </div>
                <div className="auth-provider-mark">
                  <Icon name="google" />
                </div>
              </div>
            )}

            {providers.facebook ? (
              <a className="ghost-button social-auth-button auth-secondary-social" href={api.getOAuthUrl("facebook", redirect)}>
                <Icon name="facebook" />
                {copy.auth.facebook}
              </a>
            ) : null}
          </div>

          <div className="auth-or-divider">
            <span>{copy.auth.orUseEmail}</span>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              {copy.auth.email}
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                required
              />
            </label>

            <label>
              {copy.auth.password}
              <input
                type="password"
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                required
              />
            </label>

            <div className="auth-inline-links">
              <Link to={`/signup?redirect=${encodeURIComponent(redirect)}`}>{copy.auth.createInstead}</Link>
              <Link to="/forgot-password">{copy.auth.forgotPassword}</Link>
            </div>

            <div className="auth-action-row">
              <button type="submit" className="primary-button auth-submit-button" disabled={actionStatus === "loading"}>
                <Icon name="lock" />
                {copy.auth.signInAction}
              </button>
            </div>
          </form>
        </Reveal>

        <Reveal className="auth-card auth-card-side auth-showcase-card" style={{ "--auth-showcase-image": `url(${showcaseImage})` }}>
          <div className="auth-showcase-surface">
            <span>{copy.auth.loginShowcaseEyebrow}</span>
            <strong>{copy.auth.loginShowcaseTitle}</strong>
            <p>{copy.auth.loginShowcaseCopy}</p>

            <div className="auth-showcase-metrics">
              {brand.metrics.slice(0, 3).map((metric) => (
                <article key={`${metric.value}-${metric.label}`} className="auth-showcase-metric">
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </article>
              ))}
            </div>

            <ul className="auth-showcase-points">
              {copy.auth.loginHighlights?.map((item) => (
                <li key={item}>
                  <Icon name="check-circle" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

export default LoginPage;
