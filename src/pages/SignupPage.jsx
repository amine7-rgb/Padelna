import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Reveal from "../components/sections/Reveal.jsx";
import SectionTitle from "../components/sections/SectionTitle.jsx";
import Icon from "../components/ui/Icon.jsx";
import LoadingBall from "../components/ui/LoadingBall.jsx";
import ProfileAvatar from "../components/ui/ProfileAvatar.jsx";
import { getBrandContent } from "../data/brand.js";
import { getSiteCopy } from "../data/siteContent.js";
import { signupUser } from "../features/authSlice.js";
import { showToast } from "../features/uiSlice.js";
import { api } from "../services/api.js";
import { prepareAvatarDataUrl } from "../utils/avatarImage.js";
import { getMapEmbedSrc } from "../utils/locationMap.js";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  gender: "",
  avatarUrl: "",
  password: "",
  confirmPassword: "",
  phone: "",
  addressLine1: "",
  city: "",
  postalCode: "",
  locationLabel: "",
  location: { latitude: null, longitude: null }
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
  const [locating, setLocating] = useState(false);
  const [processingAvatar, setProcessingAvatar] = useState(false);
  const redirect = searchParams.get("redirect") || "/account";
  const mapSrc = useMemo(() => getMapEmbedSrc(form.location), [form.location]);
  const showcaseImage = brand.heroSlides?.[2]?.image || "/brand-media/hero-3.png";

  const updateField = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  useEffect(() => {
    if (user) {
      navigate(redirect, { replace: true });
    }
  }, [navigate, redirect, user]);

  const handleLocate = () => {
    if (!navigator.geolocation) {
      dispatch(showToast({ type: "error", message: "Geolocation is not available in this browser." }));
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setForm((current) => ({
          ...current,
          location: {
            latitude: Number(coords.latitude.toFixed(6)),
            longitude: Number(coords.longitude.toFixed(6))
          }
        }));
        setLocating(false);
        dispatch(showToast({ type: "success", message: copy.auth.locationDetected }));
      },
      () => {
        setLocating(false);
        dispatch(showToast({ type: "error", message: "Unable to read your current location." }));
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setProcessingAvatar(true);
      const avatarUrl = await prepareAvatarDataUrl(file);
      updateField("avatarUrl", avatarUrl);
      dispatch(showToast({ type: "success", message: copy.auth.profileSaved }));
    } catch (error) {
      dispatch(showToast({ type: "error", message: error.message }));
    } finally {
      setProcessingAvatar(false);
      event.target.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (form.password !== form.confirmPassword) {
      dispatch(showToast({ type: "error", message: "Passwords do not match." }));
      return;
    }

    try {
      const { confirmPassword, ...payload } = form;
      await dispatch(signupUser(payload)).unwrap();
      dispatch(showToast({ type: "success", message: copy.auth.accountCreated }));
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
            <SectionTitle eyebrow={copy.auth.signupEyebrow} title={copy.auth.signupTitle} copy={copy.auth.signupCopy} />

            <div className="auth-highlight-row">
              {copy.auth.signupHighlights?.map((item) => (
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
            <div className="auth-form-section">
              <div className="auth-form-section-head">
                <span>{copy.auth.identitySection}</span>
                <p>{copy.auth.identitySectionCopy}</p>
              </div>

              <div className="auth-form-section-grid">
                <div className="auth-avatar-card wide">
                  <ProfileAvatar avatarUrl={form.avatarUrl} gender={form.gender} name={`${form.firstName} ${form.lastName}`.trim()} className="auth-avatar-preview" />
                  <div className="auth-avatar-copy">
                    <span>{copy.auth.profilePhoto}</span>
                    <strong>{copy.auth.avatarHint}</strong>
                  </div>
                  <div className="auth-avatar-actions">
                    <label className="ghost-button auth-upload-button">
                      <Icon name="camera" />
                      {processingAvatar ? copy.common.loading : copy.auth.uploadPhoto}
                      <input type="file" accept="image/*" onChange={handleAvatarChange} hidden />
                    </label>
                    {form.avatarUrl ? (
                      <button type="button" className="ghost-button" onClick={() => updateField("avatarUrl", "")}>
                        <Icon name="trash" />
                        {copy.auth.removePhoto}
                      </button>
                    ) : null}
                  </div>
                </div>

                <label>
                  {copy.auth.firstName}
                  <input value={form.firstName} onChange={(event) => updateField("firstName", event.target.value)} required />
                </label>

                <label>
                  {copy.auth.lastName}
                  <input value={form.lastName} onChange={(event) => updateField("lastName", event.target.value)} required />
                </label>

                <label>
                  {copy.auth.email}
                  <input type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} required />
                </label>

                <label>
                  {copy.auth.phone}
                  <input type="tel" value={form.phone} onChange={(event) => updateField("phone", event.target.value)} required />
                </label>

                <div className="auth-choice-group wide">
                  <span>{copy.auth.gender}</span>
                  <div className="chip-group">
                    <button type="button" className={form.gender === "men" ? "active" : ""} onClick={() => updateField("gender", "men")}>
                      <Icon name="user-men" />
                      {copy.auth.men}
                    </button>
                    <button type="button" className={form.gender === "women" ? "active" : ""} onClick={() => updateField("gender", "women")}>
                      <Icon name="user-women" />
                      {copy.auth.women}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="auth-form-section">
              <div className="auth-form-section-head">
                <span>{copy.auth.deliverySection}</span>
                <p>{copy.auth.deliverySectionCopy}</p>
              </div>

              <div className="auth-form-section-grid">
                <label className="wide">
                  {copy.auth.address}
                  <input value={form.addressLine1} onChange={(event) => updateField("addressLine1", event.target.value)} required />
                </label>

                <label>
                  {copy.auth.city}
                  <input value={form.city} onChange={(event) => updateField("city", event.target.value)} required />
                </label>

                <label>
                  {copy.auth.postalCode}
                  <input value={form.postalCode} onChange={(event) => updateField("postalCode", event.target.value)} />
                </label>

                <label className="wide">
                  {copy.auth.locationLabel}
                  <input
                    value={form.locationLabel}
                    onChange={(event) => updateField("locationLabel", event.target.value)}
                    placeholder={copy.auth.locationLabelPlaceholder}
                  />
                </label>

                <div className="auth-location-card wide">
                  <div className="auth-location-copy">
                    <span>{copy.auth.locationPreview}</span>
                    <strong>{copy.auth.noLocationYet}</strong>
                  </div>
                  <button type="button" className="ghost-button" onClick={handleLocate} disabled={locating}>
                    <Icon name="map-pin" />
                    {copy.auth.useCurrentLocation}
                  </button>
                  {mapSrc ? <iframe className="auth-map-frame" src={mapSrc} loading="lazy" title={copy.auth.locationPreview} /> : null}
                </div>
              </div>
            </div>

            <div className="auth-form-section">
              <div className="auth-form-section-head">
                <span>{copy.auth.securitySection}</span>
                <p>{copy.auth.securitySectionCopy}</p>
              </div>

              <div className="auth-form-section-grid">
                <label>
                  {copy.auth.password}
                  <input type="password" value={form.password} onChange={(event) => updateField("password", event.target.value)} required />
                </label>

                <label>
                  {copy.auth.confirmPassword}
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={(event) => updateField("confirmPassword", event.target.value)}
                    required
                  />
                </label>
              </div>
            </div>

            <div className="auth-inline-links">
              <span>{copy.auth.loginInstead}</span>
              <Link to={`/login?redirect=${encodeURIComponent(redirect)}`}>{copy.auth.signInAction}</Link>
            </div>

            <div className="auth-action-row">
              <button type="submit" className="primary-button auth-submit-button" disabled={actionStatus === "loading"}>
                <Icon name="shield" />
                {copy.auth.signupAction}
              </button>
            </div>
          </form>
        </Reveal>

        <Reveal className="auth-card auth-card-side auth-showcase-card" style={{ "--auth-showcase-image": `url(${showcaseImage})` }}>
          <div className="auth-showcase-surface">
            <span>{copy.auth.signupShowcaseEyebrow}</span>
            <strong>{copy.auth.signupShowcaseTitle}</strong>
            <p>{copy.auth.signupShowcaseCopy}</p>

            <div className="auth-showcase-metrics">
              {brand.metrics.slice(1, 4).map((metric) => (
                <article key={`${metric.value}-${metric.label}`} className="auth-showcase-metric">
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </article>
              ))}
            </div>

            <ul className="auth-showcase-points">
              {copy.auth.signupHighlights?.map((item) => (
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

export default SignupPage;
