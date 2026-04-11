function SectionTitle({ eyebrow, title, copy, align = "left" }) {
  return (
    <div className={`section-title ${align}`}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2>{title}</h2>
      {copy ? <p>{copy}</p> : null}
    </div>
  );
}

export default SectionTitle;

