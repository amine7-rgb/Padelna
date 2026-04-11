import { useDispatch, useSelector } from "react-redux";
import {
  clearFilters,
  setPriceFilter,
  setRatingFilter,
  setSearchFilter,
  setSortFilter,
  toggleCategoryFilter,
  toggleGenderFilter,
  toggleInStockFilter,
  toggleNewOnlyFilter
} from "../../features/productsSlice.js";

function FilterSidebar() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items);
  const filters = useSelector((state) => state.products.filters);
  const priceBounds = useSelector((state) => state.products.priceBounds);
  const categories = [...new Set(products.map((product) => product.category))];
  const genders = [...new Set(products.map((product) => product.gender))];

  return (
    <aside className="filter-sidebar">
      <div className="filter-block">
        <span>Recherche live</span>
        <input
          value={filters.search}
          onChange={(event) => dispatch(setSearchFilter(event.target.value))}
          placeholder="Tapez polo, femme, bleu..."
        />
      </div>

      <div className="filter-block">
        <span>Categories</span>
        <div className="chip-group">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={filters.categories.includes(category) ? "active" : ""}
              onClick={() => dispatch(toggleCategoryFilter(category))}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-block">
        <span>Genre</span>
        <div className="chip-group">
          {genders.map((gender) => (
            <button
              key={gender}
              type="button"
              className={filters.genders.includes(gender) ? "active" : ""}
              onClick={() => dispatch(toggleGenderFilter(gender))}
            >
              {gender}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-block">
        <span>Prix en dinars</span>
        <div className="price-range">
          <input
            type="number"
            min={priceBounds.min}
            max={filters.maxPrice}
            value={filters.minPrice}
            onChange={(event) =>
              dispatch(
                setPriceFilter({
                  minPrice: Math.min(Number(event.target.value), filters.maxPrice),
                  maxPrice: filters.maxPrice
                })
              )
            }
          />
          <input
            type="number"
            min={filters.minPrice}
            max={priceBounds.max}
            value={filters.maxPrice}
            onChange={(event) =>
              dispatch(
                setPriceFilter({
                  minPrice: filters.minPrice,
                  maxPrice: Math.max(Number(event.target.value), filters.minPrice)
                })
              )
            }
          />
        </div>
      </div>

      <div className="filter-block">
        <span>Filtrage avance</span>
        <label className="switch-row">
          <input type="checkbox" checked={filters.inStock} onChange={() => dispatch(toggleInStockFilter())} />
          <span>Seulement en stock</span>
        </label>
        <label className="switch-row">
          <input type="checkbox" checked={filters.newOnly} onChange={() => dispatch(toggleNewOnlyFilter())} />
          <span>Seulement les nouveautes</span>
        </label>
      </div>

      <div className="filter-block">
        <span>Note minimum</span>
        <select value={filters.rating} onChange={(event) => dispatch(setRatingFilter(Number(event.target.value)))}>
          <option value={0}>Toutes les notes</option>
          <option value={4}>4+ / 5</option>
          <option value={4.5}>4.5+ / 5</option>
        </select>
      </div>

      <div className="filter-block">
        <span>Trier par</span>
        <select value={filters.sort} onChange={(event) => dispatch(setSortFilter(event.target.value))}>
          <option value="featured">Mise en avant</option>
          <option value="newest">Nouveautes</option>
          <option value="rating">Meilleure note</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix decroissant</option>
        </select>
      </div>

      <button type="button" className="ghost-button" onClick={() => dispatch(clearFilters())}>
        Reinitialiser
      </button>
    </aside>
  );
}

export default FilterSidebar;

