import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";

const ProductCard = ({
  product, // ✅ fixed: using `product` instead of `p`
  userId,
  favourites = [],
  addFavorite,
  removeFavorite,
  className = "",
}) => {
  const dispatch = useDispatch();

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Item added successfully", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  return (
    <div
      className={`max-w-sm relative transition-shadow duration-300 hover:shadow-2xl rounded-lg bg-blue-100 dark:bg-gray-800 dark:border dark:border-gray-700 ${className}`}
    >
      <section className="relative">
        <Link to={`/product/${product._id}`}>
          <div className="w-full h-48 md:h-64 overflow-hidden rounded-t-lg">
            <img
              className="cursor-pointer w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              src={product.image}
              alt={product.name}
              loading="lazy"
            />
          </div>
          <span className="absolute bottom-3 right-3 bg-pink-100 text-pink-900 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300">
            {product?.brand}
          </span>
        </Link>

        {/* ❤️ Heart Icon */}
        <HeartIcon
          className="absolute top-2 right-2 transition-transform duration-150 hover:scale-110"
          productId={product._id}
          userId={userId}
          favourites={favourites}
          addFavorite={addFavorite}
          removeFavorite={removeFavorite}
        />
      </section>

      <div className="p-5">
        <div className="flex justify-between items-center">
          <h5 className="mb-2 text-xl text-black dark:text-white">
            {product?.name}
          </h5>
          <p className="font-bold text-gray-800 dark:text-white">
            {product?.price?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </p>
        </div>

        <p className="mb-3 font-normal text-gray-700 dark:text-gray-300">
          {product?.description?.substring(0, 60)} ...
        </p>

        <div className="flex justify-between items-center">
          <Link
            to={`/product/${product._id}`}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg shadow-sm shadow-gray-400 dark:shadow-none hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800"
          >
            Read More
            <svg
              className="w-3.5 h-3.5 ml-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
              aria-hidden="true"
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

          <button
            type="button"
            onClick={() => addToCartHandler(product, 1)}
            className="p-2 rounded-full focus:outline-none  focus:ring-2 focus:ring-blue-500"
            aria-label="Add to Cart"
          >
            <AiOutlineShoppingCart size={25} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
