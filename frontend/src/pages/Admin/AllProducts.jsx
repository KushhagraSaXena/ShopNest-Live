import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import AdminMenu from "./AdminMenu";
import { FaThLarge, FaList , FaStar, FaRegStar } from "react-icons/fa"; // Icons for toggle

const AllProducts = () => {
  const navigate = useNavigate();
  const [useCardStyle, setUseCardStyle] = useState(true); // toggle state
const [favorites, setFavorites] = useState([]); //for favourite logic
const [showFavoritesOnTop, setShowFavoritesOnTop] = useState(false);
const toggleFavorite = (id) => {
  setFavorites((prev) =>
    prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
  );
};

  const { data: products, isLoading, isError } = useAllProductsQuery();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading products</div>;

  return (
    <div className="container mx-[9rem]">
      <div className="flex flex-col md:flex-row">
        <div className="p-3">
          <div className="ml-[2rem] text-xl font-bold h-12 mb-4 flex justify-between items-center">
            <span>All Products ({products.length})</span>

            {/* Toggle Button */}
             <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFavoritesOnTop(!showFavoritesOnTop)}
                className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg hover:shadow"
                title="Toggle favorite-first display"
              >
                <FaStar className="text-yellow-500" />
                {showFavoritesOnTop ? "Show All" : "Favs First"}
              </button>

              <button
                onClick={() => setUseCardStyle(!useCardStyle)}
                className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg hover:shadow"
                title="Toggle product view style"
              >
                {useCardStyle ? <FaList /> : <FaThLarge />}
                {useCardStyle ? "List View" : "Card View"}
              </button>
            </div>
          </div>
          <div className="flex flex-wrap justify-around items-center">
            {[...products]
              .sort((a, b) => {
                if (!showFavoritesOnTop) return 0;
                const aFav = favorites.includes(a._id);
                const bFav = favorites.includes(b._id);
                return bFav - aFav; // Sort: true > false
              })
              .map((product) =>
              useCardStyle ? (
                <div
                  key={product._id}
                  onClick={() => navigate(`/admin/product/update/${product._id}`)}
                  className="mb-3 cursor-pointer border border-gray-200 dark:border-gray-700 rounded-lg shadow-md p-2 bg-white dark:bg-[#2026477b] hover:shadow-lg transition-all duration-300 w-[95%] mx-auto"
                >
                  <div className="flex">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-[10rem] h-[10rem] object-cover rounded-md"
                    />
                    <div className="p-4 flex flex-col justify-between w-full">
                      <div className="flex justify-between">
                        <h5 className="text-xl font-semibold mb-2">
                         
                         <span onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(product._id);
                          }} className="cursor-pointer mr-2">
                            {favorites.includes(product._id) ? (
                              <FaStar className="text-yellow-400" />
                            ) : (
                              <FaRegStar className="text-gray-400 hover:text-yellow-400" />
                            )}
                          </span>
                        
                          {product?.name}
                        </h5>
                        <p className="text-gray-400 text-xs">
                          {moment(product.createdAt).format("MMMM Do YYYY")}
                        </p>
                      </div>
                      <p className="text-gray-500 dark:text-gray-300 text-sm mb-4">
                        {product?.description?.substring(0, 160)}...
                      </p>
                      <div className="flex justify-between items-center">
                        <Link
                          to={`/admin/product/update/${product._id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-pink-700 rounded hover:bg-pink-800"
                        >
                          Update Product
                        </Link>
                        <p className="font-semibold text-gray-800 dark:text-white">
                          ${product?.price}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // 🧨 Old Style with single <Link>
                <div
                key={product._id}
                onClick={() =>
                  navigate(`/admin/product/update/${product._id}`)
                }
                  className="block mb-3 cursor-pointer mx-auto border border-gray-200 dark:border-gray-700 rounded-lg shadow-md p-1 bg-white dark:bg-[#2026477b] hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="flex">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-[10rem] object-cover"
                    />
                    <div className="p-4 flex flex-col justify-around">
                      <div className="flex justify-between">
                        <h5 className="text-xl font-semibold mb-2">

                          <span onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(product._id);
                          }} className="cursor-pointer mr-2">
                            {favorites.includes(product._id) ? (
                              <FaStar className="text-yellow-400" />
                            ) : (
                              <FaRegStar className="text-gray-400 hover:text-yellow-400" />
                            )}
                          </span>

                          {product?.name}
                        </h5>

                        <p className="text-gray-400 text-xs">
                          {moment(product.createdAt).format("MMMM Do YYYY")}
                        </p>
                      </div>

                      <p className="text-gray-400 xl:w-[30rem] lg:w-[30rem] md:w-[20rem] sm:w-[10rem] text-sm mb-4">
                        {product?.description?.substring(0, 160)}...   </p>

                      <div className="flex justify-between">
                        <Link
                          to={`/admin/product/update/${product._id}`}
                          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-pink-700 rounded-lg hover:bg-pink-800 focus:ring-4 focus:outline-none focus:ring-pink-300 dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800"
                        >
                          Update Product
                          <svg
                            className="w-3.5 h-3.5 ml-2"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 10"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M1 5h12m0 0L9 1m4 4L9 9"
                            />
                          </svg>
                        </Link>
                        <p>$ {product?.price}</p>
                      </div>
                    </div>
                  </div>
                  </div>
              )
            )}
          </div>
        </div>

        {/* Admin Menu */}
        {/* <div className="md:w-1/4 p-3 mt-2">
          <AdminMenu />
        </div> */}
      </div>
    </div>
  );
};

export default AllProducts;
