import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";
import { useSelector } from "react-redux";

const Product = ({ product, size }) => {
  const userId = useSelector((state) => state.auth.userInfo?._id);

  // Conditional classes based on size
  const imageWidth = size === "small" ? "w-[14rem]" : "w-[30rem]";
  const containerWidth = size === "small" ? "w-[15rem]" : "w-[30rem]";
  const textSize = size === "small" ? "text-sm" : "text-lg";
  const priceSize = size === "small" ? "text-xs px-2 py-0.5" : "text-sm px-2.5 py-0.5";

  return (
    <div className={`${containerWidth} ml-[1rem] p-1 relative`}>
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className={`${imageWidth} rounded`}
        />
        <HeartIcon product={product} userId={userId} />
      </div>

      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h2 className="flex justify-between items-center">
            <div className={`${textSize}`}>{product.name}</div>
            <span className="bg-pink-100 text-pink-800  font-medium mr-2 px-2.5 py-0.5 rounded-full  dark:bg-pink-800 dark:text-pink-100 whitespace-nowrap ${priceSize}">
              $ {product.price}
            </span>
          </h2>
        </Link>
      </div>
    </div>
  );
};

export default Product;