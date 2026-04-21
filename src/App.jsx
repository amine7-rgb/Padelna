import { Suspense, lazy, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Layout from "./components/layout/Layout.jsx";
import LoadingBall from "./components/ui/LoadingBall.jsx";
import { getSiteCopy } from "./data/siteContent.js";
import { fetchSession } from "./features/authSlice.js";
import RequireAuth from "./components/auth/RequireAuth.jsx";
import RequireAdmin from "./components/auth/RequireAdmin.jsx";

const HomePage = lazy(() => import("./pages/HomePage.jsx"));
const StorePage = lazy(() => import("./pages/StorePage.jsx"));
const CartPage = lazy(() => import("./pages/CartPage.jsx"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage.jsx"));
const CheckoutStatusPage = lazy(() => import("./pages/CheckoutStatusPage.jsx"));
const ProductPage = lazy(() => import("./pages/ProductPage.jsx"));
const LoginPage = lazy(() => import("./pages/LoginPage.jsx"));
const SignupPage = lazy(() => import("./pages/SignupPage.jsx"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage.jsx"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage.jsx"));
const VerifyEmailPage = lazy(() => import("./pages/VerifyEmailPage.jsx"));
const AccountPage = lazy(() => import("./pages/AccountPage.jsx"));
const AdminPage = lazy(() => import("./pages/AdminPage.jsx"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage.jsx"));

function App() {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.ui.language);
  const copy = getSiteCopy(language);
  const sessionStatus = useSelector((state) => state.auth.sessionStatus);

  useEffect(() => {
    if (sessionStatus === "idle") {
      dispatch(fetchSession());
    }
  }, [dispatch, sessionStatus]);

  return (
    <Suspense fallback={<LoadingBall label={copy.app.loading} variant="page" />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route
            path="/account"
            element={
              <RequireAuth>
                <AccountPage />
              </RequireAuth>
            }
          />
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminPage />
              </RequireAdmin>
            }
          />
          <Route
            path="/checkout"
            element={
              <RequireAuth>
                <CheckoutPage />
              </RequireAuth>
            }
          />
          <Route
            path="/checkout/:status"
            element={
              <RequireAuth>
                <CheckoutStatusPage />
              </RequireAuth>
            }
          />
          <Route path="/store/:slug" element={<ProductPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
