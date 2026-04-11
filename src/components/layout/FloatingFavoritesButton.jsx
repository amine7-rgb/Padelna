import { useDispatch, useSelector } from "react-redux";
import { toggleFavorites } from "../../features/uiSlice.js";
import Icon from "../ui/Icon.jsx";

function FloatingFavoritesButton() {
  const dispatch = useDispatch();
  const favoritesCount = useSelector((state) => state.favorites.items.length);
  const isOpen = useSelector((state) => state.ui.favoritesOpen);

  return (
    <button
      type="button"
      className={`favorites-launcher ${isOpen ? "open" : ""}`}
      aria-label="Afficher les favoris"
      aria-expanded={isOpen}
      onClick={() => dispatch(toggleFavorites())}
    >
      <span className="favorites-launcher-icon">
        <Icon name="heart" filled={favoritesCount > 0 || isOpen} />
      </span>
      <span className="favorites-launcher-text">Favoris</span>
      {favoritesCount > 0 ? <span className="favorites-launcher-badge">{favoritesCount}</span> : null}
    </button>
  );
}

export default FloatingFavoritesButton;
