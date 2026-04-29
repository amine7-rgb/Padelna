import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Reveal from "../components/sections/Reveal.jsx";
import Icon from "../components/ui/Icon.jsx";
import LoadingBall from "../components/ui/LoadingBall.jsx";
import { getBrandContent } from "../data/brand.js";
import { getSiteCopy } from "../data/siteContent.js";
import { loginUser } from "../features/authSlice.js";
import { showToast } from "../features/uiSlice.js";
import { api } from "../services/api.js";
import { resolvePostAuthRedirect } from "../utils/profileCompletion.js";

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
  const showcaseImage = brand.heroSlides?.[2]?.image || "/brand-media/hero-3.png";
  const brandBadges = useMemo(() => brand.metrics?.slice(0, 3) ?? [], [brand.metrics]);
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
      navigate(resolvePostAuthRedirect(user, redirect), { replace: true });
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
      const response = await dispatch(loginUser(form)).unwrap();
      navigate(resolvePostAuthRedirect(response.user, redirect), { replace: true });
    } catch (error) {
      dispatch(showToast({ type: "error", message: error.message }));
    }
  };

  if (!sessionChecked && actionStatus === "idle") {
    return <LoadingBall label={copy.auth.loadingSession} variant="page" />;
  }

  return (
    <div className="auth-page auth-page-login-fresh auth-page-login-lounge">
      <section className="section auth-lounge-section">
        <div className="auth-lounge-shell">
          <Reveal className="auth-lounge-visual" style={{ "--auth-lounge-image": `url(${showcaseImage})` }}>
            <div className="auth-lounge-visual-top">
              <img className="auth-brand-image" src="/logo-palina.png" alt={brand.name} />

              <div className="auth-lounge-quick-actions">
                <Link className="auth-lounge-mini-link" to="/store">
                  <Icon name="shop" />
                  {copy.header.store}
                </Link>
                <Link className="auth-lounge-cta-link" to={`/signup?redirect=${encodeURIComponent(redirect)}`}>
                  {copy.auth.signupAction}
                </Link>
              </div>
            </div>

            <div className="auth-lounge-visual-body">
              <span className="auth-lounge-kicker">{copy.auth.loginShowcaseEyebrow}</span>
              <h1>{copy.auth.loginShowcaseTitle}</h1>
              <p>{copy.auth.loginShowcaseCopy}</p>

              <div className="auth-lounge-metrics">
                {brandBadges.map((metric) => (
                  <article key={metric.label}>
                    <strong>{metric.value}</strong>
                    <span>{metric.label}</span>
                  </article>
                ))}
              </div>
            </div>

            <div className="auth-lounge-story-card">
              <div className="auth-lounge-story-copy">
                <span>{brand.tagline}</span>
                <strong>{brand.shortCopy}</strong>
              </div>

              <div className="auth-lounge-story-mark">
                <Icon name="spark" />
              </div>
            </div>
          </Reveal>

          <Reveal className="auth-lounge-panel">
            <div className="auth-lounge-card">
              <div className="auth-lounge-card-top">
                <div className="auth-lounge-card-badge">
                  <Icon name="shield" />
                  {copy.auth.loginEyebrow}
                </div>
                <h2>{copy.auth.loginTitle}</h2>
                <p>{copy.auth.loginCopy}</p>
              </div>

              <div className="auth-lounge-card-body">
                <div className="auth-social-stack auth-social-stack-centered auth-lounge-social">
                  {providers.google ? (
                    <a className="primary-button auth-google-button auth-lounge-google" href={api.getOAuthUrl("google", redirect)}>
                      <Icon name="google" />
                      {copy.auth.google}
                    </a>
                  ) : (
                    <div className="auth-provider-unavailable auth-lounge-provider-unavailable">
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
                    <a className="ghost-button social-auth-button auth-secondary-social auth-lounge-social-secondary" href={api.getOAuthUrl("facebook", redirect)}>
                      <Icon name="facebook" />
                      {copy.auth.facebook}
                    </a>
                  ) : null}
                </div>

                <div className="auth-or-divider auth-lounge-divider">
                  <span>{copy.auth.orUseEmail}</span>
                </div>

                <form className="auth-form auth-lounge-form" onSubmit={handleSubmit}>
                  <label className="auth-lounge-field">
                    <span>{copy.auth.email}</span>
                    <div className="auth-lounge-input-shell">
                      <Icon name="mail" />
                      <input
                        type="email"
                        value={form.email}
                        onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                        required
                      />
                    </div>
                  </label>

                  <label className="auth-lounge-field">
                    <span>{copy.auth.password}</span>
                    <div className="auth-lounge-input-shell">
                      <Icon name="lock" />
                      <input
                        type="password"
                        value={form.password}
                        onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                        required
                      />
                    </div>
                  </label>

                  <div className="auth-lounge-links">
                    <Link to="/forgot-password">{copy.auth.forgotPassword}</Link>
                    <Link to={`/signup?redirect=${encodeURIComponent(redirect)}`}>{copy.auth.createInstead}</Link>
                  </div>

                  <div className="auth-lounge-submit-wrap">
                    <button type="submit" className="primary-button auth-lounge-submit" disabled={actionStatus === "loading"}>
                      <Icon name="lock" />
                      {copy.auth.signInAction}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

export default LoginPage;
