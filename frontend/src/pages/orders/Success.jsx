import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import axios from "axios";

const Success = () => {
  const [params] = useSearchParams();
  const orderId = params.get("orderId");



  useEffect(() => {
    const markOrderAsPaid = async () => {
      try {
        await axios.put(`/api/orders/${orderId}/pay`, {
          id: "stripe-checkout-id", // You can store this in state if needed
          status: "succeeded",
          email_address: "user@example.com", // Replace if you can get real email
          update_time: new Date().toISOString(),
        });
        // console.log("✅ Order marked as paid");
      } catch (err) {
        // console.error("❌ Error marking order paid:", err.message);
      }
    };

    if (orderId) {
      markOrderAsPaid();
    }
  }, [orderId]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 dark:bg-gray-900 px-4 transition-colors duration-300">
      <CheckCircle className="text-green-600 dark:text-green-400" size={80} />
      <h1 className="text-3xl font-bold text-green-700 dark:text-green-300 mt-4">
        Payment Successful!
      </h1>
      <p className="text-lg mt-2 text-green-800 dark:text-green-200">
        Thank you for your purchase!
      </p>
      {orderId && (
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
          Your Order ID: {orderId}
        </p>
      )}
      {/* <h1 className="text-3xl font-bold text-green-700 mt-4">Payment Successful!</h1>
      <p className="text-lg mt-2 text-green-800">
        Thank you for your order. A confirmation has been sent to your email.
      </p> */}

      <div className="flex gap-4 mt-6">
        <Link
          to="/"
          className="bg-blue-500 hover:bg-blue-600 dark:bg-pink-600 dark:hover:bg-pink-700 text-white px-6 py-2 rounded transition"
        >
          Back to Shop
        </Link>
        <Link
          to="/user-orders"
          className="border border-blue-500 text-blue-600 dark:border-pink-600 dark:text-pink-400 px-6 py-2 rounded hover:bg-blue-100 dark:hover:bg-pink-900 transition"
        >
          View Orders
        </Link>
      </div>
    </div>
  );
};

export default Success;
