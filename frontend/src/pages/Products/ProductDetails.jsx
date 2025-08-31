import { useState, useLayoutEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";
import {
  addFavorite,
   removeFavorite,
   fetchFavorites,
 } from "../../redux/features/Favorites/favoriteSlice";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);
   const userId = useSelector((state) => state.auth.userInfo?._id);
const favourites = useSelector((state) => state.favorites.favorites);

      const handleAddFavorite = async ({ productId }) => {
        if (!userInfo?._id) return;
        await dispatch(addFavorite({ userId: userInfo._id, productId }));
        dispatch(fetchFavorites(userInfo._id));
      };

      const handleRemoveFavorite = async ({ productId }) => {
        if (!userInfo?._id) return;
        await dispatch(removeFavorite({ userId: userInfo._id, productId }));
        dispatch(fetchFavorites(userInfo._id));
      };

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  //   const [activeTab, setActiveTab] = useState(() => {
  //   if (typeof window !== 'undefined' && window.location.hash === "#reviews") {
  //     return 2;
  //   }
  //   return 1;
  // });

  const [activeTab, setActiveTab] = useState(1); // always start at tab 1


useLayoutEffect(() => {
  if (window.location.hash === "#reviews") {
    setActiveTab(2);
  }
}, []);


const handleTabChange = (tabNum) => {
  setActiveTab(tabNum);
  if (tabNum === 2) {
    window.location.hash = "#reviews";
    // smooth scroll to reviews
    setTimeout(() => {
      document.getElementById("reviews-section")?.scrollIntoView({ 
        behavior: "smooth" 
      });
    }, 100);
  } else {
    window.history.replaceState(null, "", window.location.pathname);
  }
};



  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review created successfully");
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  return (
    <>
      <div>
        <Link
          to="/"
          className="dark:text-white hover:text-blue-400 dark:hover:text-blue-500 font-semibold hover:underline ml-[2rem]"
        >
          Go Back
        </Link>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.message}
        </Message>
      ) : (
        <>
          <div className="flex flex-wrap relative items-between mt-[2rem] ml-[2rem]">
            <div>
              {/* <img
                src={product.image}
                alt={product.name}
                className="w-full xl:w-[50rem] lg:w-[45rem] md:w-[30rem] sm:w-[20rem] mr-[2rem]"
              /> */}

              <img
                src={product.image}
                alt={product.name}
                className="w-full xl:w-[42rem] lg:w-[36rem] md:w-[28rem] sm:w-[22rem] mr-[2rem] rounded-lg shadow-md"
              />
              <HeartIcon
  productId={product._id}
  userId={userId}
  favourites={favourites}
 addFavorite={handleAddFavorite}
   removeFavorite={handleRemoveFavorite}
/>
            </div>

            <div className="flex flex-col justify-between">
              <h2 className="text-2xl font-semibold">{product.name}</h2>
              <p className="my-4 xl:w-[35rem] lg:w-[35rem] md:w-[30rem] text-gray-500 dark:text-gray-300">
                {product.description}
              </p>

              <p className="text-5xl my-4 font-extrabold">$ {product.price}</p>

              <div className="flex items-center justify-between w-[20rem]">
                <div className="one">
                  <h1 className="flex items-center mb-6">
                    <FaStore className="mr-2 text-purple-500" /> Brand:{" "}
                    {product.brand}
                  </h1>
                  <h1 className="flex items-center mb-6 w-[20rem]">
                    <FaClock className="mr-2 text-gray-800 dark:text-white" /> Added:{" "}
                    {moment(product.createAt).fromNow()}
                  </h1>
                  <h1 className="flex items-center mb-6">
                    <FaStar className="mr-2 text-yellow-400" /> Reviews:{" "}
                    {product.numReviews}
                  </h1>
                </div>

                <div className="two">
                  <h1 className="flex items-center mb-6">
                    <FaStar className="mr-2 text-yellow-500" /> Ratings:  {rating}
                  </h1>
                  <h1 className="flex items-center mb-6">
                    <FaShoppingCart className="mr-2 text-green-400" /> Quantity:{" "}
                    {product.quantity}
                  </h1>
                  <h1 className="flex items-center mb-6 w-[10rem]">
                    <FaBox className="mr-2 text-gray-500" /> In Stock:{" "}
                    {product.countInStock}
                  </h1>
                </div>
              </div>

              <div className="flex justify-between flex-wrap text-yellow-400">
              <Ratings
                value={product.rating}
                  // text={`${product.numReviews} Reviews`}
                  // onClick={() => handleTabChange(2)}
                text={
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={() => handleTabChange(2)}
                    onKeyDown={(e) => e.key === "Enter" && setActiveTab(2)}
                    className="ml-2 cursor-pointer text-black dark:text-white hover:text-blue-500 hover:underline transition duration-150"
                  >
                    {`${product.numReviews} Reviews`}
                  </span>
                }
              />

                {product.countInStock > 0 && (
                  <div>
                    <select
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                      className="p-2 w-[6rem] rounded-lg text-black border border-gray-400 hover:border-gray-500  focus:border-blue-400
                       focus:outline-none focus:ring-2 focus:ring-blue-300 dark:text-white dark:border-gray-600 dark:focus:border-pink-600 dark:focus:ring-pink-500 dark:bg-gray-800"
                    >
                      {[...Array(product.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="btn-container">
                <button
                  onClick={addToCartHandler}
                  disabled={product.countInStock === 0}
                  className="dark:bg-pink-600 dark:hover:bg-pink-800 dark:text-white py-2 px-4 rounded-lg mt-4 md:mt-0 bg-blue-500 text-white font-bold hover:bg-blue-700 transition-colors duration-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add To Cart
                </button>
              </div>
            </div>

            <div className="mt-[5rem] container flex flex-wrap items-start justify-between ml-[1rem]">
              
              <ProductTabs
                loadingProductReview={loadingProductReview}
                userInfo={userInfo}
                submitHandler={submitHandler}
                rating={rating}
                setRating={setRating}
                comment={comment}
                setComment={setComment}
                product={product}
                activeTab={activeTab}
                setActiveTab={handleTabChange}
                  userId = {userId}
                  favourites={favourites}
              addFavorite={handleAddFavorite}
              removeFavorite={handleRemoveFavorite}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ProductDetails;