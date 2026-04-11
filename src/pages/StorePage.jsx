import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FilterSidebar from "../components/product/FilterSidebar.jsx";
import ProductGrid from "../components/product/ProductGrid.jsx";
import Reveal from "../components/sections/Reveal.jsx";
import SectionTitle from "../components/sections/SectionTitle.jsx";
import LoadingBall from "../components/ui/LoadingBall.jsx";
import { fetchProducts } from "../features/productsSlice.js";
import { selectFilteredProducts } from "../utils/productFilters.js";

function StorePage() {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.products.status);
  const filteredProducts = useSelector(selectFilteredProducts);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  return (
    <div className="store-page">
      <section className="section store-hero">
        <Reveal>
          <SectionTitle
            eyebrow="Store"
            title="Find your Padelna pieces with fast, precise filtering."
            copy="Live search, categories, gender, price, stock, new drops and smart sorting help every shopper find the right fit."
          />
        </Reveal>
      </section>

      <section className="section store-layout">
        <FilterSidebar />
        <div className="store-grid-wrap">
          <div className="store-grid-header">
            <strong>{filteredProducts.length} product(s)</strong>
            <span>Designed for padel, club life and active movement.</span>
          </div>

          {status === "loading" ? (
            <LoadingBall label="Loading the catalog..." variant="section" />
          ) : filteredProducts.length ? (
            <ProductGrid products={filteredProducts} />
          ) : (
            <div className="empty-state">
              No product matches these filters yet. Try another combination.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default StorePage;
