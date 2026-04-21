import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Reveal from "../components/sections/Reveal.jsx";
import SectionTitle from "../components/sections/SectionTitle.jsx";
import Icon from "../components/ui/Icon.jsx";
import LoadingBall from "../components/ui/LoadingBall.jsx";
import { getSiteCopy } from "../data/siteContent.js";
import { verifyUserEmail } from "../features/authSlice.js";

function VerifyEmailPage() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const language = useSelector((state) => state.ui.language);
  const copy = getSiteCopy(language);
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState(copy.auth.loadingSession);

  useEffect(() => {
    const run = async () => {
      if (!token) {
        setStatus("error");
        setMessage(copy.auth.emailVerifiedError);
        return;
      }

      try {
        await dispatch(verifyUserEmail({ token })).unwrap();
        setStatus("success");
        setMessage(copy.auth.emailVerifiedSuccess);
      } catch (error) {
        setStatus("error");
        setMessage(error.message || copy.auth.emailVerifiedError);
      }
    };

    run();
  }, [copy.auth.emailVerifiedError, copy.auth.emailVerifiedSuccess, dispatch, token]);

  if (status === "loading") {
    return <LoadingBall label={copy.auth.loadingSession} variant="page" />;
  }

  return (
    <div className="auth-page">
      <section className="section auth-layout single">
        <Reveal className="auth-card auth-card-main auth-feedback-card">
          <SectionTitle eyebrow={copy.auth.verifyEyebrow} title={copy.auth.verifyTitle} copy={copy.auth.verifyCopy} />
          <div className="auth-status-icon">
            <Icon name={status === "success" ? "check-circle" : "alert-circle"} />
          </div>
          <p>{message}</p>
          <div className="hero-actions">
            <Link to="/account" className="primary-button">
              <Icon name="user" />
              {copy.header.account}
            </Link>
            <Link to="/login" className="ghost-button">
              <Icon name="lock" />
              {copy.auth.signInAction}
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

export default VerifyEmailPage;
