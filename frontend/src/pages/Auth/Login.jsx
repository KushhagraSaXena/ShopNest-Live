import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLoginMutation } from "../../redux/api/usersApiSlice";
import { setCredientials } from "../../redux/features/auth/authSlice";
import { setFavorites } from "../../redux/features/Favorites/favoriteSlice";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { fetchFavorites } from "../../redux/features/Favorites/favoriteSlice";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading, isError, error }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  // If user is already logged in, redirect to the specified page

useEffect(() => {
  if (userInfo) {
    dispatch(fetchFavorites(userInfo._id));
    navigate(redirect);
  }
}, [dispatch, userInfo, navigate, redirect]);
// Update background color based on dark mode
// This effect runs once on mount and whenever the class changes

  useEffect(() => {
    const updateBackground = () => {
      const isDark = document.documentElement.classList.contains("dark");
      const bgColor = isDark ? "#111827" : "#ffffff";
      document.documentElement.style.backgroundColor = bgColor;
      document.body.style.backgroundColor = bgColor;
    };

    // Run initially
    updateBackground();

    // Observe class changes on <html>
    const observer = new MutationObserver(updateBackground);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredientials({ ...res }));
    } catch (error) {
      toast.error(error?.data?.message || "Invalid email or password");
    }
  };

  return (
    <section className="w-full h-screen flex items-center justify-center bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="flex flex-wrap items-center justify-center max-w-7xl w-full px-6 py-12">
        {/* Form Section */}
        <div className="w-full md:w-1/2 lg:w-1/2">
          <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            Sign In
          </h1>
          <form onSubmit={submitHandler} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block mb-1 text-sm font-medium text-gray-800 dark:text-gray-300"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white autofill:bg-white dark:autofill:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-400"
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                autoComplete="email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-1 text-sm font-medium text-gray-800 dark:text-gray-300"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-400 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300 focus:outline-none"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600 transition-colors duration-200"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>

            {isError && (
              <p className="text-red-500 text-sm mt-2">
                {error?.data?.message}
              </p>
            )}
            {isLoading && <Loader />}
          </form>

          <p className="mt-6 text-sm text-gray-800 dark:text-gray-300">
            New Customer?{" "}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
              className="text-pink-500 hover:underline"
            >
              Register
            </Link>
          </p>
        </div>

        {/* Image Section */}
        <div className="hidden md:block md:w-1/2 lg:w-1/2 px-6">
          <img
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80"
            alt="Login Visual"
            className="rounded-lg object-cover max-h-[36rem] w-full"
          />
        </div>
      </div>
    </section>
  );
};

export default Login;

//changes by chatgpt