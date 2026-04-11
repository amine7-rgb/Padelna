function QuantitySelector({ value, onDecrease, onIncrease }) {
  return (
    <div className="quantity-selector">
      <button type="button" onClick={onDecrease}>
        -
      </button>
      <span>{value}</span>
      <button type="button" onClick={onIncrease}>
        +
      </button>
    </div>
  );
}

export default QuantitySelector;
