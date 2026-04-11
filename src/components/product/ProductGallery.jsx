import { useEffect, useState } from "react";

function ProductGallery({ product }) {
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    setSelected(0);
  }, [product?.slug]);

  if (!product) {
    return null;
  }

  return (
    <div className="product-gallery">
      <div className="gallery-main">
        <img src={product.images[selected]?.url} alt={product.images[selected]?.alt || product.name} />
      </div>
      <div className="gallery-thumbs">
        {product.images.map((image, index) => (
          <button
            key={image.url}
            type="button"
            className={selected === index ? "active" : ""}
            onClick={() => setSelected(index)}
          >
            <img src={image.url} alt={image.alt} loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  );
}

export default ProductGallery;
