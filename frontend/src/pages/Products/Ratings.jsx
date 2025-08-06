import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const Ratings = ({ value, text, color }) => {

    const isString = typeof text === 'string';

  const fullStars = Math.floor(value);
  const halfStars = value - fullStars > 0.5 ? 1 : 0;
  const emptyStar = 5 - fullStars - halfStars;

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {[...Array(fullStars)].map((_, index) => (
        <FaStar key={index} className={`text-${color}`} />
      ))}

      {halfStars === 1 && <FaStarHalfAlt className={`text-${color}`} />}
      {[...Array(emptyStar)].map((_, index) => (
        <FaRegStar key={index} className={`text-${color}`} />
      ))}

      {text && (
        isString ? (
          <span
            role="button"
            tabIndex={0}
            onClick={onClick}
            onKeyDown={(e) => e.key === "Enter" && onClick()}
            className="ml-2 cursor-pointer text-black dark:text-white hover:text-blue-500 hover:underline transition-all duration-150"
          >
            {text}
          </span>
        ) : (
          <span className="ml-2">{text}</span>
        )
      )}
    </div>
  );
};

Ratings.defaultProps = {
  color: "yellow-500",
};

export default Ratings;
