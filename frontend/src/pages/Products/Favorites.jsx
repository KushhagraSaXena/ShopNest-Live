import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Product from "./Product";
import { FaHeart } from "react-icons/fa";
import {
  addFavorite,
  removeFavorite,
  fetchFavorites,
} from "../../redux/features/Favorites/favoriteSlice";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";

const Favorites = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.userInfo?._id);
  const favorites = useSelector((state) => state.favorites.favorites);
  const { data: products = [] } = useAllProductsQuery();

  // ✅ Fetch favorites on load
  React.useEffect(() => {
    if (userId) {
      dispatch(fetchFavorites(userId));
    }
  }, [dispatch, userId]);

  const handleAddFavorite = async ({ productId }) => {
    if (!userId) return;
    await dispatch(addFavorite({ userId, productId }));
    dispatch(fetchFavorites(userId));
  };

  const handleRemoveFavorite = async ({ productId }) => {
    if (!userId) return;
    await dispatch(removeFavorite({ userId, productId }));
    dispatch(fetchFavorites(userId));
  };

  const favoriteProducts = products.filter((p) =>
    favorites.includes(p._id)
  );

  return (
    <div className="ml-[10rem]">
      <h1 className="h-12 text-2xl font-bold dark:text-gray-100 ml-[1rem] mt-[2rem] mb-[1rem] flex gap-1">
        FAVORITE PRODUCTS
        <FaHeart className="text-pink-600 text-3xl p-1" />
      </h1>

      <div className="flex flex-wrap">
        {favoriteProducts.map((product) => (
          <Product
            key={product._id}
            product={product}
            size="small"
            userId={userId} // ✅ pass userId
            favourites={favorites} // ✅ pass favorites
            addFavorite={handleAddFavorite}
            removeFavorite={handleRemoveFavorite}
          />
        ))}
      </div>
    </div>
  );
};

export default Favorites;
