import { useEffect, useState } from "react";
import Icon from "./Icon.jsx";

const resolveFallbackIcon = (gender) => {
  if (gender === "men") {
    return "user-men";
  }

  if (gender === "women") {
    return "user-women";
  }

  return "user";
};

function ProfileAvatar({ avatarUrl = "", gender = "", name = "", className = "" }) {
  const fallbackIcon = resolveFallbackIcon(gender);
  const [hasImageError, setHasImageError] = useState(false);

  useEffect(() => {
    setHasImageError(false);
  }, [avatarUrl]);

  if (avatarUrl && !hasImageError) {
    return (
      <span className={`profile-avatar ${className}`.trim()} aria-hidden="true">
        <img src={avatarUrl} alt="" onError={() => setHasImageError(true)} />
      </span>
    );
  }

  return (
    <span className={`profile-avatar ${className}`.trim()} aria-hidden="true">
      <Icon name={fallbackIcon} />
    </span>
  );
}

export default ProfileAvatar;
