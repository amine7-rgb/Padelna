function Star({ active }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={active ? "active" : ""}>
      <path d="M12 2.8L14.9 8.7L21.4 9.7L16.7 14.4L17.8 21L12 17.9L6.2 21L7.3 14.4L2.6 9.7L9.1 8.7L12 2.8Z" />
    </svg>
  );
}

function RatingStars({ rating, reviewCount }) {
  const filledStars = Math.round(rating);

  return (
    <div className="rating-stars" aria-label={`Note ${rating} sur 5`}>
      <div className="star-row">
        {Array.from({ length: 5 }, (_, index) => (
          <Star key={index} active={index < filledStars} />
        ))}
      </div>
      <span>
        {rating.toFixed(1)}
        {typeof reviewCount === "number" ? ` (${reviewCount})` : ""}
      </span>
    </div>
  );
}

export default RatingStars;

