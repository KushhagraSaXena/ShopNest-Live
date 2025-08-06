import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useEffect } from "react"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";


import moment from "moment";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";

const NextArrow = ({ onClick }) => (
  <div
    className="absolute top-1/2 right-2 z-10 transform -translate-y-1/2 cursor-pointer
        w-10 h-10 flex items-center justify-center rounded-full 
     bg-blue-50 hover:bg-blue-100
     dark:bg-gray-800 dark:hover:bg-gray-700 
   shadow-md transition duration-200 text-2xl "
    onClick={onClick}
  >
    <FaChevronRight />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div
    className="absolute top-1/2 left-2 z-10 transform -translate-y-1/2 cursor-pointer 
    w-10 h-10 flex items-center justify-center rounded-full 
     bg-blue-50 hover:bg-blue-100
     dark:bg-gray-800 dark:hover:bg-gray-700 
   shadow-md transition duration-200
    text-2xl text-gray-500 dark:text-white"
    onClick={onClick}
  >
    <FaChevronLeft />
  </div>
);


const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };


  useEffect(() => {
  const observer = new MutationObserver(() => {
    const clonedSlides = document.querySelectorAll(".slick-slide.slick-cloned");
    clonedSlides.forEach((el) => {
      el.setAttribute("inert", "true");
      el.setAttribute("aria-hidden", "true"); // optional fallback for older browsers
    });
  });

  const slickTrack = document.querySelector(".slick-track");
  if (slickTrack) {
    observer.observe(slickTrack, { childList: true, subtree: true });
  }

  // Initial run
  const clonedSlides = document.querySelectorAll(".slick-slide.slick-cloned");
  clonedSlides.forEach((el) => {
    el.setAttribute("inert", "true");
    el.setAttribute("aria-hidden", "true");
  });

  return () => observer.disconnect();
}, []);


  return (
    <div className="mb-4 p-0">
      {/* sm:p-4 lg:p-12 xl:p-16 */}
      {isLoading ? null : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Slider
          {...settings}
          className="w-full max-w-[56rem] mx-auto"
          // className="xl:w-[50rem]  lg:w-[50rem] md:w-[56rem] sm:w-[40rem] sm:block"
          >
          {products.map(
            ({
              image,
              _id,
              name,
              price,
              description,
              brand,
              createdAt,
              numReviews,
              rating,
              quantity,
              countInStock,
            }) => (
              <div key={_id}>
                <img
                  src={image}
                  alt={name}
                    loading="lazy"
            className={`
              w-full object-cover rounded-lg
              h-[26rem] sm:h-[20rem] md:h-[24rem] lg:h-[30rem] xl:h-[36rem]`}
              // h-[44rem] lg:h-[36rem] md:h-[30rem] sm:h-[20rem] xs:h-[14rem]
                  // className="w-full rounded-lg object-cover h-[44rem]"
                />

                <div className="mt-4 flex justify-between">
                  <div className="one">
                    <h2>{name}</h2>
                    <p> $ {price}</p> <br /> <br />
                    <p className="w-[25rem]">
                      {description.substring(0, 170)} ...
                    </p>
                  </div>

                  <div className="flex justify-between w-[20rem] p-2">
                    <div className="one">
                      <h1 className="flex items-center mb-6">
                        <FaStore className="mr-2 text-purple-800 dark:text-white" /> Brand: {brand}
                      </h1>
                      <h1 className="flex items-center mb-6">
                        <FaClock className="mr-2 text-blue-700 dark:text-white" /> Added:{" "}
                        {moment(createdAt).fromNow()}
                      </h1>
                      <h1 className="flex items-center mb-6">
                        <FontAwesomeIcon icon={faComments} className="text-gray-600 dark:text-white mr-2" /> Reviews: {numReviews}
                        {/* <FaStar className="mr-2 text-yellow-600 dark:text-white" /> Reviews:  {numReviews} */}
                      </h1>
                    </div>

                    <div className="two">
                      <h1 className="flex items-center mb-6">
                        <FaStar className="mr-2 text-yellow-600 dark:text-white" /> Ratings:{" "}
                        {Math.round(rating)}
                      </h1>
                      <h1 className="flex items-center mb-6">
                        <FaShoppingCart className="mr-2 text-green-500 dark:text-white" /> Quantity:{" "}
                        {quantity}
                      </h1>
                      <h1 className="flex items-center mb-6">
                        <FaBox className="mr-2 text-amber-800 dark:text-white" /> In Stock:{" "}
                        {countInStock}
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </Slider>
      )}
    </div>
  );
};

export default ProductCarousel;