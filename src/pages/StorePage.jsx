import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FilterSidebar from "../components/product/FilterSidebar.jsx";
import ProductGrid from "../components/product/ProductGrid.jsx";
import Reveal from "../components/sections/Reveal.jsx";
import SectionTitle from "../components/sections/SectionTitle.jsx";
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
            title="Choisissez vos pieces Padelna avec un multi-filtre rapide et precis."
            copy="Recherche live, categories, genre, prix, stock, nouveautes et tri intelligent pour aider le client a trouver sa tenue ideale."
          />
        </Reveal>
      </section>

      <section className="section store-layout">
        <FilterSidebar />
        <div className="store-grid-wrap">
          <div className="store-grid-header">
            <strong>{filteredProducts.length} produit(s)</strong>
            <span>Designe pour le padel, le club et la vie sportive.</span>
          </div>

          {status === "loading" ? (
            <div className="empty-state">Chargement du catalogue...</div>
          ) : filteredProducts.length ? (
            <ProductGrid products={filteredProducts} />
          ) : (
            <div className="empty-state">
              Aucun produit ne correspond a ces filtres. Essayez une autre combinaison.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default StorePage;

