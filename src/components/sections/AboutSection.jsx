import { useSelector } from "react-redux";
import { getBrandContent } from "../../data/brand.js";
import Reveal from "./Reveal.jsx";
import SectionTitle from "./SectionTitle.jsx";

function AboutSection() {
  const language = useSelector((state) => state.ui.language);
  const brand = getBrandContent(language);

  return (
    <section id="about" className="section">
      <Reveal>
        <SectionTitle eyebrow={brand.story.eyebrow} title={brand.story.title} copy={brand.story.intro} />
      </Reveal>

      <div className="about-grid">
        <Reveal className="about-story-card">
          <ul>
            {brand.story.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </Reveal>

        <div className="promise-grid">
          {brand.promises.map((promise) => (
            <Reveal key={promise.title} className="promise-card">
              <span>{promise.title}</span>
              <p>{promise.copy}</p>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="collection-ribbon">
        {brand.categories.map((category) => (
          <Reveal key={category.title} className="collection-card">
            <h3>{category.title}</h3>
            <p>{category.copy}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export default AboutSection;
