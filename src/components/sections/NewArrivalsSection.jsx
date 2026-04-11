import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectNewArrivals } from "../../utils/productFilters.js";
import { getSiteCopy } from "../../data/siteContent.js";
import ProductGrid from "../product/ProductGrid.jsx";
import Reveal from "./Reveal.jsx";
import SectionTitle from "./SectionTitle.jsx";
import Icon from "../ui/Icon.jsx";

function NewArrivalsSection() {
  const products = useSelector(selectNewArrivals);
  const language = useSelector((state) => state.ui.language);
  const copy = getSiteCopy(language);

  return (
    <section id="new-arrivals" className="section section-alt">
      <Reveal>
        <SectionTitle
          eyebrow={copy.newArrivals.eyebrow}
          title={copy.newArrivals.title}
          copy={copy.newArrivals.copy}
        />
      </Reveal>
      <ProductGrid products={products} compact />
      <Reveal className="section-cta-center">
        <Link to="/store" className="primary-button">
          <Icon name="shop" />
          {copy.newArrivals.cta}
        </Link>
      </Reveal>
    </section>
  );
}

export default NewArrivalsSection;
