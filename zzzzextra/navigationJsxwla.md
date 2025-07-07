
import { useState, useEffect } from "react";
import {
  AiOutlineHome, AiOutlineShopping, AiOutlineLogin,
  AiOutlineUserAdd, AiOutlineShoppingCart
} from 'react-icons/ai';
import { FaHeart, FaMoon, FaSun } from 'react-icons/fa';
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import "./Navigation.css";
import { useSelector, useDispatch } from 'react-redux'
// import {useLoginMutation}from "../../../src/redux/api/usersApiSlice";
import {useLogoutMutation} from "../../../src/redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";


const Navigation = () => {

  const { userInfo } = useSelector(state => state.auth)

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [ShowSidebar, setShowSidebar] = useState(false)

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleSidebar = () => {
    setShowSidebar(!ShowSidebar);
  };

  const closeSidebar = () => {
    setShowSidebar(false);
  };

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [logoutApiCall] = useLogoutMutation()

  const logoutHandler = async () => {
    try{
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
        console.error(error)
    }
  } 

  // Dark mode toggle state, now synced with localStorage
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return document.documentElement.classList.contains("dark");
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      document.documentElement.style.backgroundColor = "#18181b"; // or "#000" for pure black
      document.body.style.backgroundColor = "#18181b"; // or "#000"
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.backgroundColor = "#f3f4f6"; // Tailwind's gray-100
      document.body.style.backgroundColor = "#f3f4f6";
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <div
      style={{ zIndex: 999 }}
      className={`
        ${ShowSidebar ? "hidden" : "flex"} xl:flex lg:flex md:hidden sm:hidden
        flex-col justify-between p-4
        ${isDark ? "bg-[#23272f] text-white" : "bg-black text-white"}
        w-[4%] hover:w-[15%] h-[100vh] fixed
      `}
      id="navigation-container"
    >
      <div className="flex flex-col justify-center space-y-4">
        <Link 
          to="/" 
          className="flex items-center transition-transform transform hover:translate-x-2"
        >
          <AiOutlineHome className="mr-2 mt-[3rem]" size={26}/>
          <span className="hidden nav-item-name mt-[3rem]">HOME</span>
        </Link>
        <Link 
          to="/shop" 
          className="flex items-center transition-transform transform hover:translate-x-2"
        >
          <AiOutlineShopping className="mr-2 mt-[3rem]" size={26}/>
          <span className="hidden nav-item-name mt-[3rem]">SHOP</span>
        </Link>
        <Link 
          to="/cart" 
          className="flex items-center transition-transform transform hover:translate-x-2"
        >
          <AiOutlineShoppingCart className="mr-2 mt-[3rem]" size={26}/>
          <span className="hidden nav-item-name mt-[3rem]">CART</span>
        </Link>
        <Link 
          to="/favorites" 
          className="flex items-center transition-transform transform hover:translate-x-2"
        >
          <FaHeart className="mr-2 mt-[3rem]" size={26}/>
          <span className="hidden nav-item-name mt-[3rem]">Favorites</span>
        </Link>
        {/* Dark mode toggle button as a sidebar button */}
        <button
          onClick={toggleDarkMode}
          className="flex items-center transition-transform transform hover:translate-x-2 mt-[3rem] px-0 py-0 bg-transparent"
          title="Toggle dark mode"
        >
          {!isDark ? (
            <FaMoon className="mr-2 mt-[3rem]" size={26} />
          ) : (
            <FaSun className="mr-2 mt-[3rem]" size={26} />
          )}
          <span className="hidden nav-item-name mt-[3rem] whitespace-nowrap overflow-hidden text-ellipsis max-w-[7rem]">
            {!isDark ? "Dark Mode" : "Light Mode"}
          </span>
        </button>
      </div>

      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center focus:outline-none group"
        >
          {userInfo ? (
            <span className="relative mr-2">
              {/* Initial (default, hides when sidebar is expanded/hovered) */}
              <span
                className={`
                  flex items-center justify-center
                  bg-[#353945] text-white
                  text-2xl font-bold rounded-full
                  w-10 h-10
                  transition-all duration-300
                  absolute inset-0
                  ${/* Hide initial when sidebar is hovered/expanded */''}
                  group-hover:w-0 group-hover:opacity-0
                `}
                title={userInfo.username}
              >
                {userInfo.username?.charAt(0).toUpperCase()}
              </span>
              {/* Full username (shows when sidebar is hovered/expanded) */}
              <span
                className={`
                  flex items-center justify-center
                  bg-[#353945] text-white
                  text-lg font-semibold rounded-full
                  w-0 min-w-0 h-10 px-0
                  transition-all duration-300
                  opacity-0
                  group-hover:w-auto group-hover:min-w-[2.5rem] group-hover:px-4 group-hover:opacity-100
                  group-hover:relative group-hover:z-10
                `}
                style={{ left: 0 }}
              >
                {userInfo.username}
              </span>
            </span>
          ) : (
            <></>
          )}

          {userInfo && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 ml-1 transition-transform duration-300 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
              />
            </svg>
          )}
        </button>

            {dropdownOpen && userInfo && (
              <ul className={`absolute right-0 mt-0 mr-0 space-y-2 bg-[#18181b] text-gray-50 
              ${!userInfo.isAdmin ? "-top-20" : "-top-80"
              }`}
              >
                {userInfo.isAdmin && (
                  <>
                  <li>
                    <Link
                      to="/admin/dashboard"
                      className="block px-4 py-2 hover:bg-[#1e2129]">Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/productlist"
                      className="block px-4 py-2 hover:bg-[#1e2129]">Products
                    </Link>
                  </li>  <li>
                    <Link
                      to="/admin/categorylist"
                      className="block px-4 py-2 hover:bg-[#1e2129]">Category
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/orderlist"
                      className="block px-4 py-2 hover:bg-[#1e2129]">Orders
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/userlist"
                      className="block px-4 py-2 hover:bg-[#1e2129]">Users
                    </Link>
                  </li>
                  </>
                )}

<li>
                    <Link
                      // to="/admin/profile"
                      to="/profile"
                      className="block px-4 py-2 hover:bg-[#1e2129]">Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/logout"
                      onClick={logoutHandler}
                      className="block px-4 py-2 hover:bg-[#1e2129]">Logout
                    </Link>
                  </li>
                  
              </ul>
            )}

      </div>
          
          {!userInfo && 
                  <ul>
                  <li>
                  <Link 
                      to="/login" 
                      className="flex items-center transition-transform transform 
                        hover:translate-x-2"
                      >
                        <AiOutlineLogin className="mr-2 mt-[3rem]" size={26}/>
                        <span className="hidden nav-item-name mt-[3rem]">Login</span> {" "}
                    </Link>
                  </li>
                  <li>
                  <Link 
                      to="/register" 
                      className="flex items-center transition-transform transform 
                        hover:translate-x-2"
                      >
                        <AiOutlineHome className="mr-2 mt-[3rem]" size={26}/>
                        <span className="hidden nav-item-name mt-[3rem]">Register</span> {" "}
                    </Link>
                  </li>
                </ul>
          }

    </div>
  );

};

export default Navigation