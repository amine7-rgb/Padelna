import { useSelector } from "react-redux";
import { getSiteCopy } from "../../data/siteContent.js";
import Icon from "../ui/Icon.jsx";

function Toast({ toast, onClose }) {
  const language = useSelector((state) => state.ui.language);
  const copy = getSiteCopy(language);

  return (
    <div className={`toast ${toast.type || "info"}`} role="status" aria-live="polite">
      <div className="toast-badge" />
      <p>{toast.message}</p>
      <button type="button" onClick={onClose} aria-label={copy.toast.close}>
        <Icon name="close" />
      </button>
    </div>
  );
}

export default Toast;
