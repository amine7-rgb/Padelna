import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectNewArrivals } from "../../utils/productFilters.js";
import ProductGrid from "../product/ProductGrid.jsx";
import Reveal from "./Reveal.jsx";
import SectionTitle from "./SectionTitle.jsx";

function NewArrivalsSection() {
  const products = useSelector(selectNewArrivals);

  return (
    <section id="new-arrivals" className="section section-alt">
      <Reveal>
        <SectionTitle
          eyebrow="Nouveautes"
          title="Les pieces 2026 qui lancent l'univers Padelna."
          copy="Une premiere selection capsule qui met en avant notre niveau de finition, notre identite tunisienne et notre exigence sur les tissus."
        />
      </Reveal>
      <ProductGrid products={products} compact />
      <Reveal className="section-cta-center">
        <Link to="/store" className="primary-button">
          Voir toute la boutique
        </Link>
      </Reveal>
    </section>
  );
}

export default NewArrivalsSection;

