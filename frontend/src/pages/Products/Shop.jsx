import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProductCard from "./ProductCard";
import { fetchProducts } from "../../redux/features/products/productSlice";
import {
  addFavorite,
  removeFavorite,
  fetchFavorites,
} from "../../redux/features/Favorites/favoriteSlice";

const Shop = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { products, loading, error } = useSelector((state) => state.products);
  const { favorites } = useSelector((state) => state.favorites);

  // Fetch products and user favorites on mount and when user changes
  useEffect(() => {
    dispatch(fetchProducts());
    if (userInfo?._id) {
      dispatch(fetchFavorites(userInfo._id));
    }
  }, [dispatch, userInfo]);

  // Add favorite and refetch favorites
  const handleAddFavorite = async ({ productId }) => {
    if (!userInfo?._id) return;
    await dispatch(addFavorite({ userId: userInfo._id, productId }));
    dispatch(fetchFavorites(userInfo._id));
  };

  // Remove favorite and refetch favorites
  const handleRemoveFavorite = async ({ productId }) => {
    if (!userInfo?._id) return;
    await dispatch(removeFavorite({ userId: userInfo._id, productId }));
    dispatch(fetchFavorites(userInfo._id));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          p={product}
          userId={userInfo?._id}
          favourites={favorites}
          addFavorite={handleAddFavorite}
          removeFavorite={handleRemoveFavorite}
        />
      ))}
    </div>
  );
};

export default Shop;
