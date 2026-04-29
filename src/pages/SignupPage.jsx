import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Reveal from "../components/sections/Reveal.jsx";
import Icon from "../components/ui/Icon.jsx";
import LoadingBall from "../components/ui/LoadingBall.jsx";
import { getBrandContent } from "../data/brand.js";
import { getSiteCopy } from "../data/siteContent.js";
import { signupUser } from "../features/authSlice.js";
import { showToast } from "../features/uiSlice.js";
import { api } from "../services/api.js";
import { resolvePostAuthRedirect } from "../utils/profileCompletion.js";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: ""
};

function SignupPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const language = useSelector((state) => state.ui.language);
  const { providers, actionStatus, sessionChecked, user } = useSelector((state) => state.auth);
  const copy = getSiteCopy(language);
  const brand = getBrandContent(language);
  const [form, setForm] = useState(initialForm);
  const redirect = searchParams.get("redirect") || "/account";
  const showcaseImage = brand.heroSlides?.[1]?.image || "/brand-media/hero-2.png";
  const brandBadges = useMemo(() => brand.metrics?.slice(0, 3) ?? [], [brand.metrics]);

  const updateField = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  useEffect(() => {
    if (user) {
      navigate(resolvePostAuthRedirect(user, redirect), { replace: true });
    }
  }, [navigate, redirect, user]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (form.password !== form.confirmPassword) {
      dispatch(showToast({ type: "error", message: "Passwords do not match." }));
      return;
    }

    try {
      const { confirmPassword, ...payload } = form;
      const response = await dispatch(signupUser(payload)).unwrap();
      dispatch(showToast({ type: "success", message: copy.auth.accountCreated }));
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
                <Link className="auth-lounge-cta-link" to={`/login?redirect=${encodeURIComponent(redirect)}`}>
                  {copy.auth.signInAction}
                </Link>
              </div>
            </div>

            <div className="auth-lounge-visual-body">
              <span className="auth-lounge-kicker">{copy.auth.signupShowcaseEyebrow}</span>
              <h1>{copy.auth.signupShowcaseTitle}</h1>
              <p>{copy.auth.signupShowcaseCopy}</p>

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

          <Reveal className="auth-lounge-panel auth-lounge-panel-signup">
            <div className="auth-lounge-card auth-lounge-card-signup">
              <div className="auth-lounge-card-top">
                <div className="auth-lounge-card-badge">
                  <Icon name="user" />
                  {copy.auth.signupEyebrow}
                </div>
                <h2>{copy.auth.signupTitle}</h2>
                <p>{copy.auth.signupCopy}</p>
              </div>

              <div className="auth-lounge-card-scroll">
                <div className="auth-lounge-card-body auth-lounge-card-body-signup">
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

                  <form className="auth-form auth-lounge-form auth-lounge-form-signup" onSubmit={handleSubmit}>
                    <div className="auth-lounge-grid">
                      <label className="auth-lounge-field">
                        <span>{copy.auth.firstName}</span>
                        <div className="auth-lounge-input-shell">
                          <Icon name="user" />
                          <input value={form.firstName} onChange={(event) => updateField("firstName", event.target.value)} required />
                        </div>
                      </label>

                      <label className="auth-lounge-field">
                        <span>{copy.auth.lastName}</span>
                        <div className="auth-lounge-input-shell">
                          <Icon name="user" />
                          <input value={form.lastName} onChange={(event) => updateField("lastName", event.target.value)} required />
                        </div>
                      </label>

                      <label className="auth-lounge-field auth-lounge-field-wide">
                        <span>{copy.auth.email}</span>
                        <div className="auth-lounge-input-shell">
                          <Icon name="mail" />
                          <input type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} required />
                        </div>
                      </label>

                      <label className="auth-lounge-field">
                        <span>{copy.auth.password}</span>
                        <div className="auth-lounge-input-shell">
                          <Icon name="lock" />
                          <input type="password" value={form.password} onChange={(event) => updateField("password", event.target.value)} required />
                        </div>
                      </label>

                      <label className="auth-lounge-field">
                        <span>{copy.auth.confirmPassword}</span>
                        <div className="auth-lounge-input-shell">
                          <Icon name="lock" />
                          <input type="password" value={form.confirmPassword} onChange={(event) => updateField("confirmPassword", event.target.value)} required />
                        </div>
                      </label>
                    </div>


                    <div className="auth-lounge-links auth-lounge-links-centered">
                      <span>{copy.auth.loginInstead}</span>
                      <Link to={`/login?redirect=${encodeURIComponent(redirect)}`}>{copy.auth.signInAction}</Link>
                    </div>

                    <div className="auth-lounge-submit-wrap">
                      <button type="submit" className="primary-button auth-lounge-submit" disabled={actionStatus === "loading"}>
                        <Icon name="shield" />
                        {copy.auth.signupAction}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

export default SignupPage;
