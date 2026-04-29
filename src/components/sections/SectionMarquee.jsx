import { useSelector } from "react-redux";
import { getSiteCopy } from "../../data/siteContent.js";

function SectionMarquee({ items: itemsProp, label: labelProp }) {
  const language = useSelector((state) => state.ui.language);
  const copy = getSiteCopy(language);
  const items = itemsProp || copy.home.marqueeItems || [];
  const label = labelProp || copy.home.marqueeLabel;

  if (!items.length) {
    return null;
  }

  return (
    <div className="section-marquee" aria-label={label}>
      <div className="section-marquee-track">
        {[0, 1].map((groupIndex) => (
          <div
            key={groupIndex}
            className="section-marquee-group"
            aria-hidden={groupIndex === 1 ? "true" : undefined}
          >
            {items.map((item, index) => (
              <span key={`${groupIndex}-${index}`} className="section-marquee-item">
                <span>{item}</span>
                <span className="section-marquee-separator" aria-hidden="true" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SectionMarquee;
