import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  addFavorite,
  removeFavorite,
} from "../../redux/features/Favorites/favoriteSlice";
import { toast } from "react-toastify";

const HeartIcon = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const userId = useSelector((state) => state.auth.userInfo?._id);
  const favorites = useSelector((state) => state.favorites.favorites) || [];

  const isFavorite = favorites.includes(product._id);

  // const toggleFavorites = async (e) => {
  //   e.stopPropagation();

  //   if (!userId) {
  //     toast.info("Please login to mark favorites", {
  //       position: "top-right",
  //       autoClose: 2000,
  //       theme: "colored",
  //       autoClose: 3000,
  //     });

  //     // Redirect to login with redirect path back to current location
  //     navigate(`/login?redirect=${location.pathname}`);
  //     return;
  //   }

  //   if (isFavorite) {
  //     await dispatch(removeFavorite({ userId, productId: product._id }));
  //   } else {
  //     await dispatch(addFavorite({ userId, productId: product._id }));
  //   }
  // };

  const toggleFavorites = async (e) => {
  e.stopPropagation();
  if (!userId) {
    toast.info("Please login to mark favorites");
    navigate("/login?redirect=" + window.location.pathname);
    return;
  }

  if (isFavorite) {
    dispatch(removeFavorite({ userId, productId: product._id }));
  } else {
    dispatch(addFavorite({ userId, productId: product._id }));
  }
};


  return (
    <div
      className="absolute top-2 right-3 z-10 cursor-pointer"
      onClick={toggleFavorites}
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
      // style={{ touchAction: "manipulation", userSelect: "none" }}
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
// This component renders a heart icon that toggles between filled and outlined based on whether the product is in favorites.
// It handles adding/removing favorites and redirects to login if the user is not authenticated.