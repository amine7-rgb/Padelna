import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getBrandContent } from "../../data/brand.js";
import { getSiteCopy } from "../../data/siteContent.js";
import { useTypingWords } from "../../utils/useTypingWords.js";
import Reveal from "./Reveal.jsx";
import Icon from "../ui/Icon.jsx";

function HeroCarousel() {
  const language = useSelector((state) => state.ui.language);
  const brand = getBrandContent(language);
  const copy = getSiteCopy(language);
  const [slide, setSlide] = useState(0);
  const current = brand.heroSlides[slide];
  const typed = useTypingWords(brand.typingWords, 62, 1500);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSlide((currentSlide) => (currentSlide + 1) % brand.heroSlides.length);
    }, 5200);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section id="home" className="hero" style={{ "--hero-image": `url(${current.image})` }}>
      <Reveal className="hero-content">
        <p className="eyebrow">{current.eyebrow}</p>
        <h1>
          {current.title}
          <span>{typed}</span>
        </h1>
        <p className="hero-copy">
          {brand.shortCopy}
        </p>
        <div className="hero-actions">
          <Link className="primary-button" to="/store">
            <Icon name="shop" />
            {copy.hero.shopNow}
          </Link>
          <a className="ghost-button" href="/#about">
            <Icon name="arrow-right" />
            {copy.hero.meetBrand}
          </a>
        </div>
        <div className="hero-proof">
          {brand.metrics.map((metric) => (
            <article key={metric.label}>
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </article>
          ))}
        </div>
        <div className="hero-dots" aria-label={copy.hero.changeSlide}>
          {brand.heroSlides.map((item, index) => (
            <button
              key={item.id}
              className={slide === index ? "active" : ""}
              type="button"
              onClick={() => setSlide(index)}
            />
          ))}
        </div>
      </Reveal>
    </section>
  );
}

export default HeroCarousel;
