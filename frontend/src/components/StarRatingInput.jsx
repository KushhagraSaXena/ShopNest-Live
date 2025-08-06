import { useState } from "react";
import { FaStar } from "react-icons/fa";

const StarRatingInput = ({ rating, setRating }) => {
  const [hover, setHover] = useState(null);
  const ratingLabels = {
  1: "Inferior",
  2: "Decent",
  3: "Great",
  4: "Excellent",
  5: "Exceptional",
};


  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="focus:outline-none"
          onClick={() => setRating(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(null)}
          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
        >
          <FaStar
            className={`w-8 h-8 transition-colors 
              ${star <= (hover || rating)
                ? "text-yellow-400"
                : "text-gray-300 dark:text-gray-600"
              }`}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRatingInput;
