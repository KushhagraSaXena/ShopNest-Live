import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon"

const Product = ({
  product,
  size,
  userId,
  favourites,
  addFavorite,
  removeFavorite,
}) => {
    const isSmall = size === "small";

  const imageHeight = "h-[14rem]"; 
  const imageWidth = size === "small" ? "w-[14rem]" : "w-full";
  const containerWidth = size === "small" ? "w-[15rem]" : "w-[20rem]";
  const textSize = size === "small" ? "text-sm" : "text-lg";
  const priceSize = size === "small"
    ? "text-xs px-2 py-0.5"
    : "text-sm px-2.5 py-0.5";


    const imageWrapperClasses = `
    flex items-center justify-center 
    ${imageHeight} 
    ${isSmall ? "p-4" : ""} 
    overflow-hidden 
    rounded-t-lg 
    bg-white 
    shadow-md
    hover:shadow-lg transition-shadow duration-200
    `;
    // dark:bg-[#2a2a2a] use for image card background

  return (
<div className={`relative ${containerWidth} m-4 border rounded-lg shadow-md bg-blue-100 dark:bg-[#1a1a1a]`}>
  {/* Product Image Wrapper with Link */}
  <Link to={`/product/${product._id}`}>
    {/* <div className={`flex items-center justify-center ${imageHeight} ${imageWidth} overflow-hidden rounded-t-lg`}> */}
    <div className={imageWrapperClasses}>
      <img
        src={product.image}
        alt={product.name}
        className="object-contain max-h-full max-w-full"
      />
    </div>
    {/* </div> */}
  </Link>

      {/* Heart Icon - NOT inside the link */}
      <HeartIcon
        productId={product._id}
        userId={userId}
        favourites={favourites}
        addFavorite={addFavorite}
        removeFavorite={removeFavorite}
      />

      {/* Name + Price */}
      <div className="p-4">
        <Link to={`/product/${product._id}`} className="block mb-2">
          <h3 className={`font-semibold text-black dark:text-white ${textSize}`}>
            {product.name}
          </h3>
        </Link>
        <p className={`dark:text-white text-black font-bold ${priceSize}`}>
          ${product.price}
        </p>
      </div>
    </div>
  );
};

export default Product;
