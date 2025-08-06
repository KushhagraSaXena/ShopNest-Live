import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";
import SmallProduct from "../pages/Products/SmallProduct";
import ProductCarousel from "../pages/Products/ProductCarousel";

const Header = () => {
  const { data, isLoading } = useGetTopProductsQuery();

  return (
    <header className="w-full flex flex-col lg:flex-row gap-4 px-4 sm:px-6 lg:px-10 xl:px-16 mt-8">
      {/* Left: Products Grid */}
      <div className="w-full lg:w-1/2">
        {isLoading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 place-items-center">
            {data?.map((product) => (
              <SmallProduct product={product} key={product._id} />
            ))}
          </div>
        )}
      </div>

      {/* Right: Carousel */}
      <div className="w-full lg:w-1/2">
        <ProductCarousel />
      </div>
    </header>
  );
};

export default Header;
