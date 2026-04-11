import Reveal from "../sections/Reveal.jsx";
import ProductCard from "./ProductCard.jsx";

function ProductGrid({ products, compact = false }) {
  return (
    <div className={`product-grid ${compact ? "compact-grid" : ""}`}>
      {products.map((product) => (
        <Reveal className="product-grid-item" key={product.slug}>
          <ProductCard product={product} compact={compact} />
        </Reveal>
      ))}
    </div>
  );
}

export default ProductGrid;

