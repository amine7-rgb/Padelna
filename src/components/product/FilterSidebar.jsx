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
import { getSiteCopy } from "../../data/siteContent.js";
import { getLocalizedCategory, getLocalizedGender } from "../../data/productLocale.js";
import Icon from "../ui/Icon.jsx";

function FilterSidebar() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items);
  const filters = useSelector((state) => state.products.filters);
  const priceBounds = useSelector((state) => state.products.priceBounds);
  const language = useSelector((state) => state.ui.language);
  const copy = getSiteCopy(language);
  const categories = [...new Set(products.map((product) => product.category))];
  const genders = [...new Set(products.map((product) => product.gender))];

  return (
    <aside className="filter-sidebar">
      <div className="filter-block">
        <span>{copy.filters.liveSearch}</span>
        <input
          value={filters.search}
          onChange={(event) => dispatch(setSearchFilter(event.target.value))}
          placeholder={copy.filters.liveSearchPlaceholder}
        />
      </div>

      <div className="filter-block">
        <span>{copy.filters.categories}</span>
        <div className="chip-group">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={filters.categories.includes(category) ? "active" : ""}
              onClick={() => dispatch(toggleCategoryFilter(category))}
            >
              {getLocalizedCategory(category, language)}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-block">
        <span>{copy.filters.gender}</span>
        <div className="chip-group">
          {genders.map((gender) => (
            <button
              key={gender}
              type="button"
              className={filters.genders.includes(gender) ? "active" : ""}
              onClick={() => dispatch(toggleGenderFilter(gender))}
            >
              {getLocalizedGender(gender, language)}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-block">
        <span>{copy.filters.price}</span>
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
        <span>{copy.filters.advanced}</span>
        <label className="switch-row">
          <input type="checkbox" checked={filters.inStock} onChange={() => dispatch(toggleInStockFilter())} />
          <span>{copy.filters.inStockOnly}</span>
        </label>
        <label className="switch-row">
          <input type="checkbox" checked={filters.newOnly} onChange={() => dispatch(toggleNewOnlyFilter())} />
          <span>{copy.filters.newOnly}</span>
        </label>
      </div>

      <div className="filter-block">
        <span>{copy.filters.minRating}</span>
        <select value={filters.rating} onChange={(event) => dispatch(setRatingFilter(Number(event.target.value)))}>
          <option value={0}>{copy.filters.allRatings}</option>
          <option value={4}>4+ / 5</option>
          <option value={4.5}>4.5+ / 5</option>
        </select>
      </div>

      <div className="filter-block">
        <span>{copy.filters.sortBy}</span>
        <select value={filters.sort} onChange={(event) => dispatch(setSortFilter(event.target.value))}>
          <option value="featured">{copy.filters.featured}</option>
          <option value="newest">{copy.filters.newest}</option>
          <option value="rating">{copy.filters.topRated}</option>
          <option value="price-asc">{copy.filters.priceAsc}</option>
          <option value="price-desc">{copy.filters.priceDesc}</option>
        </select>
      </div>

      <button type="button" className="ghost-button" onClick={() => dispatch(clearFilters())}>
        <Icon name="refresh" />
        {copy.filters.reset}
      </button>
    </aside>
  );
}

export default FilterSidebar;
