import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { FaInfoCircle } from "react-icons/fa";

const OrderList = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <>
      <AdminMenu />

      <div className="p-4">
        <h1 className="text-2xl font-semibold mb-4">Orders</h1>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left">Items</th>
                  <th className="px-4 py-2 text-left">Order ID</th>
                  <th className="px-4 py-2 text-left">User</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Total</th>
                  <th className="px-4 py-2 text-left">Paid</th>
                  <th className="px-4 py-2 text-left">Delivered</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, idx) => (
                  <tr
                    key={order._id}
                    className={`${
                      idx % 2 === 0
                        ? "bg-white dark:bg-[#23272f]"
                        : "bg-gray-50 dark:bg-[#18181b]"
                    } border-b border-gray-200 dark:border-gray-700`}
                  >
                    <td className="px-4 py-2">
                      <img
                        src={order.orderItems[0].image}
                        alt={order._id}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="px-4 py-2">{order._id}</td>
                    <td className="px-4 py-2">{order.user ? order.user.username : "N/A"}</td>
                    <td className="px-4 py-2">
                      {order.createdAt ? order.createdAt.substring(0, 10) : "N/A"}
                    </td>
                    <td className="px-4 py-2">${order.totalPrice}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`inline-block px-2 py-1 text-sm font-medium rounded-full text-white ${
                          order.isPaid ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        {order.isPaid ? "Completed" : "Pending"}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`inline-block px-2 py-1 text-sm font-medium rounded-full text-white ${
                          order.isDelivered ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        {order.isDelivered ? "Completed" : "Pending"}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <Link to={`/order/${order._id}`}>
                        <button className="flex items-center gap-2 text-blue-600  font-medium px-3 py-1 rounded border border-blue-500 bg-white hover:bg-blue-500 hover:text-white  hover:shadow transition duration-100">
                          <FaInfoCircle />
                          More
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default OrderList;
