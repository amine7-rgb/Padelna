import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getBrandContent } from "../../data/brand.js";
import { getSiteCopy } from "../../data/siteContent.js";

function HeroCarousel() {
  const language = useSelector((state) => state.ui.language);
  const brand = getBrandContent(language);
  const copy = getSiteCopy(language);
  const panels = [
    {
      id: "women",
      eyebrow: copy.hero.womenEyebrow,
      title: copy.hero.womenTitle,
      video: brand.heroPanels?.[0]?.video,
      poster: brand.heroPanels?.[0]?.poster || brand.heroSlides?.[1]?.image,
      accent: brand.metrics?.[1]?.label || brand.tagline
    },
    {
      id: "men",
      eyebrow: copy.hero.menEyebrow,
      title: copy.hero.menTitle,
      video: brand.heroPanels?.[1]?.video,
      poster: brand.heroPanels?.[1]?.poster || brand.heroSlides?.[2]?.image,
      accent: brand.metrics?.[2]?.label || brand.shortCopy
    }
  ];

  return (
    <section id="home" className="hero-split">
      <div className="hero-split-panels">
        {panels.map((panel) => (
          <article key={panel.id} className="hero-split-panel hero-split-panel-hoverable">
            <video
              className="hero-split-video"
              src={panel.video}
              poster={panel.poster}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
            <div className="hero-split-shade" aria-hidden="true" />
            <div className="hero-split-copy">
              <span>{panel.eyebrow}</span>
              <h2>{panel.title}</h2>
              <small>{panel.accent}</small>
              <Link className="hero-split-link" to="/store">
                {copy.hero.discover}
              </Link>
            </div>
          </article>
        ))}
      </div>
      <div className="hero-split-center" aria-label={copy.hero.centerLabel}>
        <div className="hero-split-logo-frame">
          <img src="/logo-palina.png" alt={`${brand.name} logo`} />
        </div>
        <div className="hero-split-center-copy">
          <span>{brand.tagline}</span>
          <p>{brand.shortCopy}</p>
        </div>
      </div>
    </section>
  );
}

export default HeroCarousel;
