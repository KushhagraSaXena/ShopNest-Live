import { toast } from "react-toastify";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const HeartIcon = ({ productId, userId, favourites = [], addFavorite, removeFavorite }) => {
  const isFavorite = favourites?.includes(productId);

  const toggleFavorites = async (e) => {
    e.stopPropagation();

    if (!userId) {
      toast.info("Please login to save favorites", {
        onClose: () => {
          window.location.href = "/login?redirect=" + window.location.pathname;
        },
        autoClose: 1200, // enough time for user to read it
      });
      return;
    }

    if (typeof addFavorite !== 'function' || typeof removeFavorite !== 'function') {
      console.warn("Favorite functions not passed to HeartIcon.");
      return;
    }

    if (isFavorite) {
      await removeFavorite({ productId });
    } else {
      await addFavorite({ productId });
    }
  };

  return (
    <div
      className="absolute top-2 right-3 z-10 cursor-pointer"
      onClick={toggleFavorites}
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
      onMouseDown={(e) => e.preventDefault()}
      style={{ touchAction: "manipulation", userSelect: "none" }}
    >
      {isFavorite ? (
        <FaHeart className="text-pink-600 text-2xl bg-white bg-opacity-80 rounded-full p-1 shadow-md transition-all duration-200" />
      ) : (
        <FaRegHeart className="text-gray-800 text-2xl bg-white bg-opacity-80 rounded-full p-1 shadow-md transition-all duration-200" />
      )}
    </div>
  );
};

export default HeartIcon;

