import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FilterSidebar from "../components/product/FilterSidebar.jsx";
import ProductGrid from "../components/product/ProductGrid.jsx";
import Reveal from "../components/sections/Reveal.jsx";
import SectionTitle from "../components/sections/SectionTitle.jsx";
import LoadingBall from "../components/ui/LoadingBall.jsx";
import { getSiteCopy } from "../data/siteContent.js";
import { fetchProducts } from "../features/productsSlice.js";
import { selectFilteredProducts } from "../utils/productFilters.js";

function StorePage() {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.products.status);
  const filteredProducts = useSelector(selectFilteredProducts);
  const language = useSelector((state) => state.ui.language);
  const copy = getSiteCopy(language);

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
            eyebrow={copy.store.eyebrow}
            title={copy.store.title}
            copy={copy.store.copy}
          />
        </Reveal>
      </section>

      <section className="section store-layout">
        <FilterSidebar />
        <div className="store-grid-wrap">
          <div className="store-grid-header">
            <strong>{filteredProducts.length} {copy.store.count}</strong>
            <span>{copy.store.subtitle}</span>
          </div>

          {status === "loading" ? (
            <LoadingBall label={copy.store.loading} variant="section" />
          ) : filteredProducts.length ? (
            <ProductGrid products={filteredProducts} />
          ) : (
            <div className="empty-state">{copy.store.empty}</div>
          )}
        </div>
      </section>
    </div>
  );
}

export default StorePage;
