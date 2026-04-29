import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Reveal from "../components/sections/Reveal.jsx";
import SectionTitle from "../components/sections/SectionTitle.jsx";
import Icon from "../components/ui/Icon.jsx";
import ProfileAvatar from "../components/ui/ProfileAvatar.jsx";
import { getSiteCopy } from "../data/siteContent.js";
import { changeUserPassword, logoutUser, resendVerificationEmail, updateUserProfile } from "../features/authSlice.js";
import { showToast } from "../features/uiSlice.js";
import { prepareAvatarDataUrl } from "../utils/avatarImage.js";
import { getMapEmbedSrc } from "../utils/locationMap.js";
import { isProfileComplete } from "../utils/profileCompletion.js";

function AccountPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const language = useSelector((state) => state.ui.language);
  const user = useSelector((state) => state.auth.user);
  const actionStatus = useSelector((state) => state.auth.actionStatus);
  const copy = getSiteCopy(language);
  const [form, setForm] = useState(null);
  const [passwords, setPasswords] = useState({ currentPassword: "", nextPassword: "", confirmPassword: "" });
  const [locating, setLocating] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [processingAvatar, setProcessingAvatar] = useState(false);
  const redirectTarget = searchParams.get("redirect") || "/checkout";

  useEffect(() => {
    if (!user) {
      return;
    }

    setForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      gender: user.gender || "",
      avatarUrl: user.avatarUrl || "",
      phone: user.phone || "",
      addressLine1: user.addressLine1 || "",
      city: user.city || "",
      postalCode: user.postalCode || "",
      locationLabel: user.locationLabel || "",
      location: user.location || { latitude: null, longitude: null }
    });
  }, [user]);

  useEffect(() => {
    if (!passwordModalOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setPasswordModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [passwordModalOpen]);

  const mapSrc = useMemo(() => getMapEmbedSrc(form?.location), [form]);
  const profileComplete = useMemo(() => isProfileComplete(user), [user]);
  const postProfileTarget = redirectTarget === "/account" ? "/checkout" : redirectTarget;

  if (!user || !form) {
    return null;
  }

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
      setForm((current) => ({ ...current, avatarUrl }));
      dispatch(showToast({ type: "success", message: copy.auth.profileSaved }));
    } catch (error) {
      dispatch(showToast({ type: "error", message: error.message }));
    } finally {
      setProcessingAvatar(false);
      event.target.value = "";
    }
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await dispatch(updateUserProfile(form)).unwrap();
      dispatch(showToast({ type: "success", message: copy.auth.profileSaved }));

      if (response.user?.profileComplete && redirectTarget && redirectTarget !== "/account") {
        navigate(redirectTarget, { replace: true });
      }
    } catch (error) {
      dispatch(showToast({ type: "error", message: error.message }));
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    if (passwords.nextPassword !== passwords.confirmPassword) {
      dispatch(showToast({ type: "error", message: "Passwords do not match." }));
      return;
    }

    try {
      await dispatch(
        changeUserPassword({
          currentPassword: passwords.currentPassword,
          nextPassword: passwords.nextPassword
        })
      ).unwrap();
      setPasswords({ currentPassword: "", nextPassword: "", confirmPassword: "" });
      setPasswordModalOpen(false);
      dispatch(showToast({ type: "success", message: copy.auth.passwordChanged }));
    } catch (error) {
      dispatch(showToast({ type: "error", message: error.message }));
    }
  };

  const handleLogout = async () => {
    await dispatch(logoutUser()).unwrap();
    navigate("/", { replace: true });
  };

  return (
    <div className="auth-page account-page">
      <section className="section">
        <Reveal>
          <SectionTitle eyebrow={copy.auth.accountEyebrow} title={copy.auth.accountTitle} copy={copy.auth.accountCopy} />
        </Reveal>

        <div className="account-layout">
          <Reveal className="auth-card auth-card-main">
            {!profileComplete ? (
              <div className="account-banner account-banner-priority">
                <div>
                  <span>{copy.auth.completeProfileTitle}</span>
                  <strong>{copy.auth.completeProfileCopy}</strong>
                </div>
              </div>
            ) : null}

            {!user.emailVerified ? (
              <div className="account-banner">
                <div>
                  <span>{copy.auth.unverified}</span>
                  <strong>{copy.auth.unverifiedCopy}</strong>
                </div>
                <button type="button" className="ghost-button" onClick={() => dispatch(resendVerificationEmail())}>
                  <Icon name="mail" />
                  {copy.auth.resendVerification}
                </button>
              </div>
            ) : null}

            <form className="auth-form auth-form-grid" onSubmit={handleProfileSubmit}>
              <div className="auth-avatar-card wide">
                <ProfileAvatar avatarUrl={form.avatarUrl} gender={form.gender} name={user.fullName} className="auth-avatar-preview" />
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
                    <button type="button" className="ghost-button" onClick={() => setForm((current) => ({ ...current, avatarUrl: "" }))}>
                      <Icon name="trash" />
                      {copy.auth.removePhoto}
                    </button>
                  ) : null}
                </div>
              </div>

              <label>
                {copy.auth.firstName}
                <input value={form.firstName} onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))} required />
              </label>
              <label>
                {copy.auth.lastName}
                <input value={form.lastName} onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))} required />
              </label>
              <label>
                {copy.auth.email}
                <input type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} required />
              </label>

              <div className="auth-choice-group">
                <span>{copy.auth.gender}</span>
                <div className="chip-group">
                  <button
                    type="button"
                    className={form.gender === "men" ? "active" : ""}
                    onClick={() => setForm((current) => ({ ...current, gender: "men" }))}
                  >
                    <Icon name="user-men" />
                    {copy.auth.men}
                  </button>
                  <button
                    type="button"
                    className={form.gender === "women" ? "active" : ""}
                    onClick={() => setForm((current) => ({ ...current, gender: "women" }))}
                  >
                    <Icon name="user-women" />
                    {copy.auth.women}
                  </button>
                </div>
              </div>

              <label>
                {copy.auth.phone}
                <input type="tel" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} required />
              </label>
              <label className="wide">
                {copy.auth.address}
                <input value={form.addressLine1} onChange={(event) => setForm((current) => ({ ...current, addressLine1: event.target.value }))} required />
              </label>
              <label>
                {copy.auth.city}
                <input value={form.city} onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))} required />
              </label>
              <label>
                {copy.auth.postalCode}
                <input value={form.postalCode} onChange={(event) => setForm((current) => ({ ...current, postalCode: event.target.value }))} required />
              </label>
              <label className="wide">
                {copy.auth.locationLabel}
                <input
                  value={form.locationLabel}
                  onChange={(event) => setForm((current) => ({ ...current, locationLabel: event.target.value }))}
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
              <div className="auth-action-row wide">
                <button type="submit" className="primary-button auth-submit-button" disabled={actionStatus === "loading"}>
                  <Icon name="check-circle" />
                  {copy.auth.saveProfile}
                </button>
              </div>
            </form>
          </Reveal>

          <Reveal className="auth-card auth-card-side">
            <ProfileAvatar avatarUrl={form.avatarUrl} gender={form.gender} name={user.fullName} className="account-side-avatar" />
            <span>{user.role === "admin" ? copy.auth.adminRole : copy.auth.userRole}</span>
            <strong>{user.fullName}</strong>
            <p>{user.email}</p>

            {user.hasPassword ? (
              <div className="auth-form">
                <p>{copy.auth.accountCopy}</p>
                <button type="button" className="ghost-button account-compact-button" onClick={() => setPasswordModalOpen(true)}>
                  <Icon name="lock" />
                  {copy.auth.changePasswordAction}
                </button>
              </div>
            ) : (
              <div className="auth-form">
                <p>{copy.auth.socialPasswordHint}</p>
              </div>
            )}

            <div className="auth-side-actions">
              {profileComplete ? (
                <Link to={postProfileTarget} className="primary-button account-compact-button">
                  <Icon name="credit-card" />
                  {copy.auth.continueCheckout}
                </Link>
              ) : (
                <button type="button" className="ghost-button account-compact-button" disabled>
                  <Icon name="alert-circle" />
                  {copy.auth.completeProfileAction}
                </button>
              )}
              {user.role === "admin" ? (
                <Link to="/admin" className="ghost-button account-compact-button">
                  <Icon name="shield" />
                  {copy.header.admin}
                </Link>
              ) : null}
              <button type="button" className="ghost-button account-compact-button" onClick={handleLogout}>
                <Icon name="logout" />
                {copy.auth.logout}
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {passwordModalOpen ? (
        <div className="auth-modal-backdrop" role="presentation" onClick={() => setPasswordModalOpen(false)}>
          <div className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="account-password-title" onClick={(event) => event.stopPropagation()}>
            <div className="auth-modal-header">
              <div>
                <span>{copy.auth.accountEyebrow}</span>
                <strong id="account-password-title">{copy.auth.changePasswordAction}</strong>
              </div>
              <button type="button" className="auth-modal-close" aria-label="Close password modal" onClick={() => setPasswordModalOpen(false)}>
                <Icon name="close" />
              </button>
            </div>

            <p className="auth-modal-copy">{copy.auth.resetCopy}</p>

            <form className="auth-form" onSubmit={handlePasswordSubmit}>
              <label>
                {copy.auth.currentPassword}
                <input
                  type="password"
                  value={passwords.currentPassword}
                  onChange={(event) => setPasswords((current) => ({ ...current, currentPassword: event.target.value }))}
                  required
                />
              </label>
              <label>
                {copy.auth.newPassword}
                <input
                  type="password"
                  value={passwords.nextPassword}
                  onChange={(event) => setPasswords((current) => ({ ...current, nextPassword: event.target.value }))}
                  required
                />
              </label>
              <label>
                {copy.auth.confirmPassword}
                <input
                  type="password"
                  value={passwords.confirmPassword}
                  onChange={(event) => setPasswords((current) => ({ ...current, confirmPassword: event.target.value }))}
                  required
                />
              </label>
              <div className="auth-action-row">
                <button type="submit" className="primary-button auth-submit-button" disabled={actionStatus === "loading"}>
                  <Icon name="lock" />
                  {copy.auth.changePasswordAction}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default AccountPage;
