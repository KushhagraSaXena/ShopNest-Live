

// // import { useEffect } from "react";
// // import { FaHeart, FaRegHeart, FaVaadin } from "react-icons/fa";
// // import { useSelector, useDispatch } from "react-redux";
// // import {
// //   addToFavorites,
// //   removeFromFavorites,
// //   setFavorites,
// // } from "../../redux/features/Favorites/favoriteSlice";

// // import {
// //   addFavoriteToLocalStorage,
// //   getFavoritesFromLocalStorage,
// //   removeFavoriteFromLocalStorage,
// // } from "../../../Utils/localStorage";

// // const HeartIcon = ({ product }) => {
// //   const dispatch = useDispatch();
// //   const favorites = useSelector((state) => state.favorites) || [];
// //   const isFavorite = favorites.some((p) => p._id === product._id);

// //   useEffect(() => {
// //     const favoritesFromLocalStorage = getFavoritesFromLocalStorage();
// //     dispatch(setFavorites(favoritesFromLocalStorage));
// //   }, []);

// //   const toggleFavorites = () => {
// //     if (isFavorite) {
// //       dispatch(removeFromFavorites(product));
// //       // remove the product from the localStorage as well
// //       removeFavoriteFromLocalStorage(product._id);
// //     } else {
// //       dispatch(addToFavorites(product));
// //       // add the product to localStorage as well
// //       addFavoriteToLocalStorage(product);
// //     }
// //   };

// //   return (
// //     <div
// //       className="absolute top-2 right-5 cursor-pointer"
// //       onClick={toggleFavorites}
// //     >
// //       {isFavorite ? (
// //         <FaHeart className="text-pink-600" />
// //       ) : (
// //         <FaRegHeart className="Dark:text-black" />
// //       )}
// //     </div>
// //   );
// // };

// // export default HeartIcon;


// // import { FaHeart, FaRegHeart } from "react-icons/fa";
// // import { useSelector, useDispatch } from "react-redux";
// // import {
// //   addFavorite,
// //   removeFavorite,
// //   setFavorites,
// // } from "../../redux/features/Favorites/favoriteSlice";

// // import {
// //   addFavoriteToLocalStorage,
// //   getFavoritesFromLocalStorage,
// //   removeFavoriteFromLocalStorage,
// // } from "../../../Utils/localStorage";

// // const HeartIcon = ({ product, userId }) => {
// //   const dispatch = useDispatch();
// //   const favorites = useSelector((state) => state.favorites.favorites) || [];
// //   const isFavorite = favorites.includes(product._id);
// //   // Fetch favorites from localStorage on initial render
// //   useEffect(() => {
// //     const favoritesFromLocalStorage = getFavoritesFromLocalStorage();
// //     dispatch(setFavorites(favoritesFromLocalStorage));
// //   }, [dispatch]);
// //   // Toggle favorite status
// //   // This function will be called when the heart icon is clicked

// //   const toggleFavorites = () => {
// //     if (!userId) return;
// //     if (isFavorite) {
// //       dispatch(removeFavorite({ userId, productId: product._id }));
// //       removeFavoriteFromLocalStorage(product._id);
// //     } else {
// //       dispatch(addFavorite({ userId, productId: product._id }));
// //       addFavoriteToLocalStorage(product);
// //     }
// //   };

// //   return (
// //     <div
// //       className="absolute top-2 right-3 z-10 cursor-pointer"
// //       onClick={toggleFavorites}
// //     >
// //       {isFavorite ? (
// //         <FaHeart className="text-pink-600 text-2xl bg-white bg-opacity-80 rounded-full p-1 shadow-md" />
// //       ) : (
// //         <FaRegHeart className="text-gray-800 text-2xl bg-white bg-opacity-80 rounded-full p-1 shadow-md" />
// //       )}
// //     </div>
// //   );
// // };

// // export default HeartIcon;



// //new

// import { FaHeart, FaRegHeart } from "react-icons/fa";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   addFavorite,
//   removeFavorite,
//   fetchFavorites,
// } from "../../redux/features/Favorites/favoriteSlice";

// const HeartIcon = ({ product, userId: propUserId }) => {
//   const dispatch = useDispatch();
//   // Use userId from prop or from Redux
//   const userId = propUserId || useSelector((state) => state.auth.userInfo?._id);
//   // Favorites is an array of product IDs (strings)
//   const favorites = useSelector((state) => state.favorites.favorites) || [];
//   const isFavorite = favorites.includes(product._id);

//   const toggleFavorites = async (e) => {
//     e.stopPropagation();
//     if (!userId) return;
//     if (isFavorite) {
//       await dispatch(removeFavorite({ userId, productId: product._id }));
//     } else {
//       await dispatch(addFavorite({ userId, productId: product._id }));
//     }
//     // Refetch to ensure UI is always in sync with DB
//     dispatch(fetchFavorites(userId));
//   };

//   return (
//     <div
//       className="absolute top-2 right-3 z-10 cursor-pointer"
//       onClick={toggleFavorites}
//       title={isFavorite ? "Remove from favorites" : "Add to favorites"}
//       style={{ touchAction: "manipulation" }}
//     >
//       {isFavorite ? (
//         <FaHeart className="text-pink-600 text-2xl bg-white bg-opacity-80 rounded-full p-1 shadow-md transition-all duration-200" />
//       ) : (
//         <FaRegHeart className="text-gray-800 text-2xl bg-white bg-opacity-80 rounded-full p-1 shadow-md transition-all duration-200" />
//       )}
//     </div>
//   );
// };

// export default HeartIcon;
// // This component renders a heart icon that toggles between filled and outlined states
// // based on whether the product is in the user's favorites. It uses Redux to manage the favorite