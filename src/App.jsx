import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout.jsx";

const HomePage = lazy(() => import("./pages/HomePage.jsx"));
const StorePage = lazy(() => import("./pages/StorePage.jsx"));
const CartPage = lazy(() => import("./pages/CartPage.jsx"));
const ProductPage = lazy(() => import("./pages/ProductPage.jsx"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage.jsx"));

function App() {
  return (
    <Suspense fallback={<div className="page-loader">Chargement de Padelna...</div>}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/store/:slug" element={<ProductPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
