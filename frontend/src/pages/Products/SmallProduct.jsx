import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const SmallProduct = ({
  product,
  userId,
  favourites = [],
  addFavorite,
  removeFavorite,
}) => {
  const handleCardClick = () => {
    window.location.href = `/product/${product._id}`;
  };

  const handleHeartClick = (e) => {
    e.stopPropagation(); // ✅ Prevents click bubbling to the whole card
  };

  return (
    <div className="w-full md:max-w-[22rem] h-full">
        <div className="w-full h-full rounded-lg shadow-md 
             bg-white dark:bg-gray-800 overflow-hidden 
             cursor-pointer group hover:scale-105 transition-transform"
                onClick={handleCardClick}
              >

      <div className="relative">
        <img 
          src={product.image}
          alt={product.name}
          className="w-full h-56 sm:h-64 md:h-72 object-cover  flex flex-col justify-center items-center"
        />

        
        {/* ✅ HeartIcon fixed and re-enabled */}
          {userId && (
            <div
              className="absolute top-2 right-2 z-10"
              onClick={handleHeartClick}
            >
              <HeartIcon
                productId={product._id}
                userId={userId}
                favourites={favourites}
                addFavorite={addFavorite}
                removeFavorite={removeFavorite}
              />
            </div>
          )}

      </div>

      <div className="p-4">
        <h2 className="text-md font-semibold text-gray-900 dark:text-white">
          {product.name}
        </h2>
        <p className="dark:text-white text-blue-900 font-bold mt-1">
          ${product.price}
        </p>
      </div>
    </div>
    </div>
  );
};

export default SmallProduct;
