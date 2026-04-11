import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectNewArrivals } from "../../utils/productFilters.js";
import ProductGrid from "../product/ProductGrid.jsx";
import Reveal from "./Reveal.jsx";
import SectionTitle from "./SectionTitle.jsx";
import Icon from "../ui/Icon.jsx";

function NewArrivalsSection() {
  const products = useSelector(selectNewArrivals);

  return (
    <section id="new-arrivals" className="section section-alt">
      <Reveal>
        <SectionTitle
          eyebrow="New arrivals"
          title="The 2026 pieces opening the Padelna universe."
          copy="A first capsule built to showcase premium finishing, Tunisian identity and sport-dedicated fabrics."
        />
      </Reveal>
      <ProductGrid products={products} compact />
      <Reveal className="section-cta-center">
        <Link to="/store" className="primary-button">
          <Icon name="shop" />
          View the full store
        </Link>
      </Reveal>
    </section>
  );
}

export default NewArrivalsSection;
