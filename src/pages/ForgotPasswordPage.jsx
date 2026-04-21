import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Reveal from "../components/sections/Reveal.jsx";
import SectionTitle from "../components/sections/SectionTitle.jsx";
import Icon from "../components/ui/Icon.jsx";
import { getSiteCopy } from "../data/siteContent.js";
import { forgotUserPassword } from "../features/authSlice.js";
import { showToast } from "../features/uiSlice.js";

function ForgotPasswordPage() {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.ui.language);
  const copy = getSiteCopy(language);
  const [email, setEmail] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await dispatch(forgotUserPassword({ email })).unwrap();
      dispatch(showToast({ type: "success", message: copy.auth.resetSent }));
    } catch (error) {
      dispatch(showToast({ type: "error", message: error.message }));
    }
  };

  return (
    <div className="auth-page">
      <section className="section auth-layout single">
        <Reveal className="auth-card auth-card-main">
          <SectionTitle eyebrow={copy.auth.forgotEyebrow} title={copy.auth.forgotTitle} copy={copy.auth.forgotCopy} />
          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              {copy.auth.email}
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </label>
            <div className="auth-action-row">
              <button type="submit" className="primary-button auth-submit-button">
                <Icon name="mail" />
                {copy.auth.requestReset}
              </button>
            </div>
          </form>
          <div className="auth-inline-links">
            <Link to="/login">{copy.auth.signInAction}</Link>
            <Link to="/signup">{copy.auth.signupAction}</Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

export default ForgotPasswordPage;
