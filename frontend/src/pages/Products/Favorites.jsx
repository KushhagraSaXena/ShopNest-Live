import { useSelector } from "react-redux";
import Product from "./Product";
import { FaHeart } from "react-icons/fa";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";

const Favorites = () => {
  const favoriteIds = useSelector((state) => state.favorites.favorites);
  const { data: products = [] } = useAllProductsQuery();

  // Filter products to only those in favorites
  const favoriteProducts = products.filter((p) => favoriteIds.includes(p._id));

  return (
    <div className="ml-[10rem]">
      {/* <h1 className="text-lg font-bold ml-[2rem] mt-[2rem]"> */}
      <h1 className="h-12 text-2xl font-bold text-gray-100 ml-[1rem] mt-[2rem] mb-[1rem] flex gap-1">
        FAVORITE PRODUCTS<FaHeart className="text-pink-600 text-3xl  p-1 shadow-md" />
      </h1>
      <div className="flex flex-wrap">
        {favoriteProducts.map((product) => (
          <Product key={product._id} product={product} size="small" />
        ))}
      </div>
    </div>
  );
};

export default Favorites;