import { useSelector } from "react-redux";
import { useMemo } from "react";

const FavoritesCount = () => {
  const favorites = useSelector((state) => state.favorites.favorites) || [];

  const displayCount = useMemo(() => {
    const count = favorites.length;
    return count === 0 ? null : count > 99 ? "99+" : count;
  }, [favorites]);

  if (!displayCount) return null;

  return (
    <span
      className="absolute -top-3 -right-3 md:-top-3 md:-right-3 sm:top-0 sm:right-0
        text-xs px-1.5 py-0.5 bg-pink-500 text-white rounded-full z-10"
      aria-label={`${displayCount} favorite items`}
    >
      {displayCount}
    </span>
  );
};

export default FavoritesCount;
