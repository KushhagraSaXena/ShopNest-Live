import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";
import { selectTotalQty } from "../redux/features/cart/cartSlice";

const Cart = () => {

  const totalQty = useSelector(selectTotalQty);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <>
      <div className="container justify-around items-start flex wrap mx-auto mt-8">
        {cartItems.length === 0 ? (
<div className="w-full flex justify-center mt-8">
  <div className="flex items-center space-x-3">
    <span className="text-red-600 font-bold text-xl dark:text-red-500">Cart is Empty!</span>
    <Link
      to="/shop"
      className="text-blue-500 text-xl underline font-bold hover:text-blue-800 dark:text-white dark:hover:text-blue-500"
    >
      Go To Shop
    </Link>
  </div>
</div>
        ) : (
          <>
            <div className="flex flex-col w-[80%]">
              <h1 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Shopping Cart</h1>

              {cartItems.map((item) => (
                <div key={item._id} className="flex items-enter mb-[1rem] pb-2 border-b dark:border-gray-700">
                  <div className="w-[5rem] h-[5rem]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>

                  <div className="flex-1 ml-4">
                    <Link to={`/product/${item._id}`} 
                      className="text-blue-600 dark:text-pink-400 font-semibold hover:underline">
                      {item.name}
                    </Link>

                    <div className="mt-2 text-gray-700 dark:text-gray-400">{item.brand}</div>
                    <div className="mt-2 text-gray-800 dark:text-gray-300 font-bold">
                      $ {item.price}
                    </div>
                  </div>

                  <div className="w-24">
                    <select
                      className="w-full p-1 border rounded
                      text-gray-900 dark:text-white 
                        bg-white dark:bg-gray-800 
                        border-gray-300 dark:border-gray-600"
                      value={item.qty}
                      onChange={(e) =>
                        addToCartHandler(item, Number(e.target.value))
                      }
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <button
                      className="text-red-500 dark:text-red-600 hover:text-red-600 dark:hover:text-red-800 mr-[5rem]"
                      onClick={() => removeFromCartHandler(item._id)}
                    >
                      <FaTrash className="ml-[1rem] mt-[.5rem]" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="mt-8 w-[40rem]">
                <div className="p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    {/* Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) */}
                    Items ({totalQty})
                  </h2>

                  <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    ${" "}
                    {cartItems
                      .reduce((acc, item) => acc + item.qty * item.price, 0)
                      .toFixed(2)}
                  </div>

                  <button
                    className="mt-4 py-2 px-4 rounded-full text-lg w-full font-bold
                      bg-blue-500 hover:bg-blue-700 text-white 
                      dark:bg-pink-600 dark:hover:bg-pink-700 
                      transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={cartItems.length === 0}
                    onClick={checkoutHandler}
                  >
                    Proceed To Checkout
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;
