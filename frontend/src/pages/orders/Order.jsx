import { useEffect } from "react";
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '../../../Utils/stripe';

import { Link, useParams } from "react-router-dom";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaTimesCircle, FaCheckCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Messsage from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from "../../redux/api/orderApiSlice";

const Order = () => {
  const { id: orderId } = useParams();
  const { userInfo } = useSelector((state) => state.auth);

  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const { data: paypal, isLoading: loadingPaPal, error: errorPayPal } = useGetPaypalClientIdQuery();

  // Optional currency conversion
  const currency = "USD"; // Change to "INR", "EUR", etc., if supported by PayPal

  useEffect(() => {
    if (!errorPayPal && !loadingPaPal && paypal?.clientId) {
      const loadPaypalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency,
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };

      if (order && !order.isPaid && !window.paypal) {
        loadPaypalScript();
      }
    }
  }, [errorPayPal, loadingPaPal, order, paypal, paypalDispatch, currency]);


// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

const handleStripePayment = async () => {
  try {
    const stripe = await stripePromise;

    if (!order?.orderItems || order.orderItems.length === 0) {
      toast.error("No items found in order.");
      return;
    }

    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/payments/create-checkout-session`,
      {
        orderId,
        cartItems: order.orderItems.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.qty,
          image: item.image,
        })),
      }
    );

        // ✅ Redirect directly to Stripe-hosted checkout page
    window.location.href = data.url;
  } catch (err) {
    console.error("Stripe error", err);
    toast.error("Stripe checkout failed");
  }
};


  const onApprove = async (data, actions) => {
    const details = await actions.order.capture();
    try {
      await payOrder({ orderId, details });
      refetch();
      toast.success("Order is paid");
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [{ amount: { value: order.totalPrice, currency_code: currency } }],
      })
      .then((orderID) => orderID);
  };

  const onError = (err) => toast.error(err.message);

  const deliverHandler = async () => {
    await deliverOrder(orderId);
    refetch();
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Messsage variant="danger">{error.data.message}</Messsage>
  ) : (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 px-4 py-6">
      {/* Left: Order Items */}
      <div className="w-full lg:w-2/3">
        <div className="border rounded-lg p-4 bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Order Items</h2>
          {order.orderItems.length === 0 ? (
            <Messsage>Order is empty</Messsage>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="border-b dark:border-gray-600">
                  <tr>
                    <th className="text-left py-2 px-4">Image</th>
                    <th className="text-left py-2 px-4">Product</th>
                    <th className="text-center py-2 px-4">Qty</th>
                    <th className="text-right py-2 px-4">Price</th>
                    <th className="text-right py-2 px-4">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderItems.map((item, idx) => (
                    <tr key={idx} className="border-t dark:border-gray-600">
                      <td className="py-2 px-4">
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                      </td>
                      <td className="py-2 px-4">
                        <Link to={`/product/${item.product}`} className="text-pink-600 hover:underline">
                          {item.name}
                        </Link>
                      </td>
                      <td className="py-2 px-4 text-center">{item.qty}</td>
                      <td className="py-2 px-4 text-right">${item.price}</td>
                      <td className="py-2 px-4 text-right">
                        ${(item.qty * item.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Right: Shipping + Summary */}
      <div className="w-full lg:w-1/3">
        <div className="border rounded-lg p-4 mb-4 bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Shipping</h2>
          <p className="mb-2"><strong className="text-pink-500">Order ID:</strong> {order._id}</p>
          <p className="mb-2"><strong className="text-pink-500">Name:</strong> {order.user.username}</p>
          <p className="mb-2"><strong className="text-pink-500">Email:</strong> {order.user.email}</p>
          <p className="mb-2">
            <strong className="text-pink-500">Address:</strong> {order.shippingAddress.address},{" "}
            {order.shippingAddress.city}, {order.shippingAddress.postalCode},{" "}
            {order.shippingAddress.country}
          </p>
          <p className="mb-2"><strong className="text-pink-500">Method:</strong> {order.paymentMethod}</p>

          {/* Payment Status */}
          <div className="mt-4">
            {order.isPaid ? (
              <div className="flex items-center text-green-600 dark:text-green-400">
                <FaCheckCircle className="mr-2" />
                <span>Paid on {order.paidAt}</span>
              </div>
            ) : (
              <div className="flex items-center text-red-600 dark:text-red-500">
                <FaTimesCircle className="mr-2" />
                <span>Not Paid</span>
              </div>
            )}
          </div>

          {/* Delivery Status Badge */}
          <div className="mt-2">
            {order.isDelivered ? (
              <div className="flex items-center text-green-600 dark:text-green-400">
                <FaCheckCircle className="mr-2" />
                <span>Delivered on {order.deliveredAt}</span>
              </div>
            ) : (
              <div className="flex items-center text-red-600 dark:text-red-500">
                <FaTimesCircle className="mr-2" />
                <span>Not Delivered</span>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="border rounded-lg p-4 bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Order Summary</h2>
          <div className="flex justify-between mb-2 text-gray-700 dark:text-gray-300">
            <span>Items:</span>
            <span>${order.itemsPrice}</span>
          </div>
          <div className="flex justify-between mb-2 text-gray-700 dark:text-gray-300">
            <span>Shipping:</span>
            <span>${order.shippingPrice}</span>
          </div>
          <div className="flex justify-between mb-2 text-gray-700 dark:text-gray-300">
            <span>Tax:</span>
            <span>${order.taxPrice}</span>
          </div>
          <div className="flex justify-between font-bold text-gray-800 dark:text-white mt-2">
            <span>Total:</span>
            <span>${order.totalPrice}</span>
          </div>

          {/* PayPal Buttons with animation */}
          {!order.isPaid && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-4"
              >
                {loadingPay || isPending ? <Loader /> : (
                  <>
                  <Elements stripe={stripePromise}>
                  <button
                  onClick={handleStripePayment}
                  className="mb-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                  Pay with Stripe
                </button>
                </Elements>

                  <PayPalButtons
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={onError}
                  />
                </>

                )}
              </motion.div>
            </AnimatePresence>
          )}

          {/* Mark as Delivered (Admin only) */}
          {loadingDeliver && <Loader />}
          {userInfo?.isAdmin && order.isPaid && !order.isDelivered && (
            <button
              className="mt-4 w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600"
              onClick={deliverHandler}
            >
              Mark As Delivered
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;
