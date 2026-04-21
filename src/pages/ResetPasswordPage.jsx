import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Reveal from "../components/sections/Reveal.jsx";
import SectionTitle from "../components/sections/SectionTitle.jsx";
import Icon from "../components/ui/Icon.jsx";
import { getSiteCopy } from "../data/siteContent.js";
import { resetUserPassword } from "../features/authSlice.js";
import { showToast } from "../features/uiSlice.js";

function ResetPasswordPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const language = useSelector((state) => state.ui.language);
  const copy = getSiteCopy(language);
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!token) {
      dispatch(showToast({ type: "error", message: copy.auth.emailVerifiedError }));
      return;
    }

    if (password !== confirmPassword) {
      dispatch(showToast({ type: "error", message: "Passwords do not match." }));
      return;
    }

    try {
      await dispatch(resetUserPassword({ token, password })).unwrap();
      dispatch(showToast({ type: "success", message: copy.auth.resetSuccess }));
      navigate("/account", { replace: true });
    } catch (error) {
      dispatch(showToast({ type: "error", message: error.message }));
    }
  };

  return (
    <div className="auth-page">
      <section className="section auth-layout single">
        <Reveal className="auth-card auth-card-main">
          <SectionTitle eyebrow={copy.auth.resetEyebrow} title={copy.auth.resetTitle} copy={copy.auth.resetCopy} />
          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              {copy.auth.newPassword}
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            </label>
            <label>
              {copy.auth.confirmPassword}
              <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
            </label>
            <div className="auth-action-row">
              <button type="submit" className="primary-button auth-submit-button">
                <Icon name="lock" />
                {copy.auth.resetAction}
              </button>
            </div>
          </form>
        </Reveal>
      </section>
    </div>
  );
}

export default ResetPasswordPage;
