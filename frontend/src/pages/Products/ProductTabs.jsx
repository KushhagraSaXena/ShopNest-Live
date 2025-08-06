import { Link } from "react-router-dom";
import Ratings from "./Ratings";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import SmallProduct from "./SmallProduct";
import Loader from "../../components/Loader";
import { useEffect, useRef } from "react";
import StarRatingInput from "../../components/StarRatingInput";

const ProductTabs = ({
  loadingProductReview,
  userInfo,
  submitHandler,
  rating,
  setRating,
  comment,
  setComment,
  product,
  activeTab,
  setActiveTab,

  userId,
  favourites,
  addFavorite,
  removeFavorite,
}) => {
  const { data, isLoading } = useGetTopProductsQuery();

  const ratingLabels = {
    1: "Inferior",
    2: "Decent",
    3: "Great",
    4: "Excellent",
    5: "Exceptional",
  };


  const reviewRef = useRef(null);

  useEffect(() => {
    if (activeTab === 2 && window.location.hash === "#reviews") {
      setTimeout(() => {
        reviewRef.current?.scrollIntoView({ behavior: "smooth" });

        // Optional highlight animation
        reviewRef.current?.classList.add("bg-blue-100", "dark:bg-gray-700");
        setTimeout(() => {
          reviewRef.current?.classList.remove("bg-blue-100", "dark:bg-gray-700");
        }, 1500);
      }, 200); // 300ms delay ensures DOM is mounted
    }
  }, [activeTab]);



  useEffect(() => {
    if (window.location.hash === "#reviews") {
      setTimeout(() => {
        reviewRef.current?.classList.add("bg-blue-100", "dark:bg-gray-700");
        setTimeout(() => {
          reviewRef.current?.classList.remove("bg-blue-100", "dark:bg-gray-700");
        }, 2000);
      }, 300); // delay to let tab content render

      reviewRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);


  if (isLoading) {
    return <Loader />;
  }

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  return (

    <div className="container mx-auto px-2 sm:px-4">

      <div ref={reviewRef}>
        <div className="flex flex-col md:flex-row">
          <section className="w-full md:w-auto md:mr-[5rem] flex flex-row md:flex-col justify-around md:justify-start">
            <div
              className={`flex-1 p-4 cursor-pointer text-lg ${activeTab === 1 ? "font-bold" : ""
                }`}
              onClick={() => handleTabClick(1)}
            >
              Write Your Review
            </div>
            <div
              className={`flex-1 p-4 cursor-pointer text-lg ${activeTab === 2 ? "font-bold" : ""
                }`}
              onClick={() => setActiveTab(2)}
            >
              All Reviews
            </div>

            <div
              className={`flex-1 p-4 cursor-pointer text-lg ${activeTab === 3 ? "font-bold" : ""
                }`}
              onClick={() => handleTabClick(3)}
            >
              Related Products
            </div>
          </section>

          {/* Second Part */}
          <section>
            {activeTab === 1 && (
              <div className="mt-4 px-4 sm:px-6 lg:px-12 max-w-3xl mx-auto">
                {userInfo ? (
                  <form onSubmit={submitHandler}>
                    <div className="my-2">
                      <label htmlFor="rating" className="block text-xl mb-2 text-gray-900 dark:text-gray-200">
                        Rating
                      </label>

                      {/* ⭐ Star input — always visible */}
                      <div className="mb-2">
                        <StarRatingInput rating={Number(rating)} setRating={(val) => setRating(val)} />
                        {rating > 0 && (
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Selected: <span className="font-semibold">{ratingLabels[rating]}</span>
                          </p>
                        )}
                      </div>

                      {/* 🔽 Dropdown — hidden on mobile */}
                      <div className="hidden md:block">
                        <select
                          id="rating"
                          name="rating"
                          required
                          value={rating}
                          onChange={(e) => setRating(Number(e.target.value))}
                          className="p-2 w-full md:w-[12rem] border border-gray-400 rounded-lg xl:w-[40rem] text-black
                                      hover:border-gray-500 focus:border-blue-400 focus:outline-none
                                      focus:ring-2 focus:ring-blue-300  dark:text-white dark:bg-gray-800 dark:border-gray-600 
                                      dark:focus:border-pink-600 dark:focus:ring-pink-500
                                      transition-colors duration-150">
                          <option value="">Select</option>
                          {Object.entries(ratingLabels).map(([val, label]) => (
                            <option key={val} value={val}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>


                    <div className="my-2">
                      <label htmlFor="comment" className="block text-xl mb-2">
                        Comment
                      </label>

                      <textarea
                        id="comment"
                        name="comment"
                        rows="3"
                        required
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="p-2 border rounded-lg xl:w-[40rem] text-black w-full border-gray-400 
                    hover:border-gray-500 focus:border-blue-400 focus:outline-none 
                    focus:ring-2 focus:ring-blue-300 
                    dark:text-white dark:bg-gray-800 dark:border-gray-600 
                    dark:focus:border-pink-600 dark:focus:ring-pink-500 
                    resize-none transition-colors duration-150" ></textarea>
                    </div>
                    <button
                      type="submit"
                      disabled={loadingProductReview}
                      className="dark:bg-pink-600 dark:hover:bg-pink-800 dark:text-white 
                  bg-blue-500 hover:bg-blue-700 
                  text-white font-bold py-2 px-4 rounded-lg mt-4 
                  transition-colors duration-150 
                  disabled:opacity-50 disabled:cursor-not-allowed"

                    >
                      Submit
                    </button>
                  </form>
                ) : (
                  <p>
                    Please <Link to="/login">sign in</Link> to write a review
                  </p>
                )}
              </div>
            )}
          </section>

          <section>
            {activeTab === 2 && (
              <>
                <div id="reviews" ref={reviewRef} className="p-2 transition-all rounded-md">
                  <div>{product.reviews.length === 0 && <p>No Reviews</p>}</div>

                  <div>
                    {product.reviews.map((review) => (
                      <div
                        key={review._id}
                        className=" w-full max-w-4xl mx-auto p-4 mb-5 bg-blue-100 dark:bg-gray-800 rounded-lg text-gray-900 dark:text-gray-200" >
                        <div className="flex justify-between">
                          <strong className="text-gray-600  dark:text-gray-300">{review.name}</strong>
                          <p className="text-[#8c8c8c]  dark:text-gray-500">
                            {review.createdAt.substring(0, 10)}
                          </p>
                        </div>

                        <p className="my-4 text-gray-900 dark:text-gray-200">{review.comment}</p>
                        <Ratings value={review.rating} />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </section>

          <section>
            {activeTab === 3 && (
              <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-2 sm:px-0 place-items-center">
                {!data ? (
                  <Loader />
                ) : (
                  data.map((p) => (
                    <SmallProduct
                      key={p._id}
                      product={p}
                      userId={userId}
                      favourites={favourites}
                      addFavorite={addFavorite}
                      removeFavorite={removeFavorite}
                    />
                  ))
                )}
              </section>

            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProductTabs;