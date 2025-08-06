import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";

const Cancel = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 dark:bg-gray-900 px-4">
      <XCircle className="text-red-600 dark:text-pink-600" size={80} />
      <h1 className="text-3xl font-bold text-red-700 dark:text-pink-400 mt-4">
        Payment Cancelled
      </h1>
      <p className="text-lg mt-2 text-red-800 dark:text-pink-200">
        Something went wrong or you cancelled the payment.
      </p>

      <Link
        to="/cart"
        className="mt-6 bg-red-600 dark:bg-pink-600 text-white px-6 py-2 rounded hover:bg-red-700 dark:hover:bg-pink-700 transition"
      >
        Return to Cart
      </Link>
    </div>
  );
};

export default Cancel;
