import { useState } from "react";
import { useSelector } from "react-redux";
import { getSiteCopy } from "../../data/siteContent.js";
import Icon from "../ui/Icon.jsx";

function StarRatingInput({ value, onChange }) {
  const language = useSelector((state) => state.ui.language);
  const copy = getSiteCopy(language);
  const [hovered, setHovered] = useState(0);
  const visibleValue = hovered || value;

  return (
    <div className="star-input" onMouseLeave={() => setHovered(0)}>
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1;
        const active = starValue <= visibleValue;

        return (
          <button
            key={starValue}
            type="button"
            className={active ? "active" : ""}
            aria-label={`${starValue} ${starValue > 1 ? copy.rating.stars : copy.rating.star}`}
            onMouseEnter={() => setHovered(starValue)}
            onFocus={() => setHovered(starValue)}
            onClick={() => onChange(starValue)}
          >
            <Icon name="star" />
          </button>
        );
      })}
    </div>
  );
}

export default StarRatingInput;
