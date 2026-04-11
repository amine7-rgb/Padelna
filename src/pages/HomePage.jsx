import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import HeroCarousel from "../components/sections/HeroCarousel.jsx";
import AboutSection from "../components/sections/AboutSection.jsx";
import NewArrivalsSection from "../components/sections/NewArrivalsSection.jsx";
import ContactSection from "../components/sections/ContactSection.jsx";
import { fetchProducts } from "../features/productsSlice.js";
import { selectFeaturedProducts } from "../utils/productFilters.js";
import ProductGrid from "../components/product/ProductGrid.jsx";
import Reveal from "../components/sections/Reveal.jsx";
import SectionTitle from "../components/sections/SectionTitle.jsx";
import { getSiteCopy } from "../data/siteContent.js";

function HomePage() {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.products.status);
  const featuredProducts = useSelector(selectFeaturedProducts);
  const language = useSelector((state) => state.ui.language);
  const copy = getSiteCopy(language);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  return (
    <>
      <HeroCarousel />
      <AboutSection />
      <section className="section">
        <Reveal>
          <SectionTitle
            eyebrow={copy.home.previewEyebrow}
            title={copy.home.previewTitle}
            copy={copy.home.previewCopy}
          />
        </Reveal>
        <ProductGrid products={featuredProducts} compact />
      </section>
      <NewArrivalsSection />
      <ContactSection />
    </>
  );
}

export default HomePage;
