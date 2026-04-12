import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import Layout from "./components/layout/Layout.jsx";
import LoadingBall from "./components/ui/LoadingBall.jsx";
import { getSiteCopy } from "./data/siteContent.js";

const HomePage = lazy(() => import("./pages/HomePage.jsx"));
const StorePage = lazy(() => import("./pages/StorePage.jsx"));
const CartPage = lazy(() => import("./pages/CartPage.jsx"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage.jsx"));
const CheckoutStatusPage = lazy(() => import("./pages/CheckoutStatusPage.jsx"));
const ProductPage = lazy(() => import("./pages/ProductPage.jsx"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage.jsx"));

function App() {
  const language = useSelector((state) => state.ui.language);
  const copy = getSiteCopy(language);

  return (
    <Suspense fallback={<LoadingBall label={copy.app.loading} variant="page" />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/checkout/:status" element={<CheckoutStatusPage />} />
          <Route path="/store/:slug" element={<ProductPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
