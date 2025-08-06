import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Header from "../components/Header";
import Product from "./Products/Product";
import MainLayout from "../components/MainLayout";
import {
  addFavorite,
  removeFavorite,
  fetchFavorites,
} from "../redux/features/Favorites/favoriteSlice"; // ✅ Favorites actions

const Home = () => {
  const { keyword } = useParams();
  const dispatch = useDispatch();

  const userId = useSelector((state) => state.auth.userInfo?._id);
  const favorites = useSelector((state) => state.favorites.favorites || []);
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });

  // ✅ Fetch favorites when user logs in
  useEffect(() => {
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

  return (
    <MainLayout>
      <>
        {!keyword && <Header />}

        {isLoading ? (
          <Loader />
        ) : isError ? (
          <Message variant="danger">
            {isError?.data?.message || isError.error}
          </Message>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <h1 className="ml-[20rem] mt-[10rem] text-[3rem]">
                Special Products
              </h1>

              <Link
                to="/shop"
                className="bg-blue-500 hover:bg-blue-600 dark:bg-pink-600 hover:dark:bg-pink-700 hover:shadow-md hover:text-gray-200 text-white font-bold rounded-full py-2 px-10 mr-[18rem] mt-[10rem]"
              >
                Shop
              </Link>
            </div>

            <div className="flex justify-center flex-wrap mt-[2rem]">
              {data.products.map((product) => (
                <Product
                  key={product._id}
                  product={product}
                  userId={userId} // ✅ pass userId
                  favourites={favorites} // ✅ pass favorites
                  addFavorite={handleAddFavorite} // ✅ pass handler
                  removeFavorite={handleRemoveFavorite} // ✅ pass handler
                />
              ))}
            </div>
          </>
        )}
      </>
    </MainLayout>
  );
};

export default Home;
