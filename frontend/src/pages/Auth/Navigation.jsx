import { useState, useEffect, useRef } from "react";
import {
  AiOutlineHome, AiOutlineShopping, AiOutlineLogin,
  AiOutlineUserAdd, AiOutlineShoppingCart
} from 'react-icons/ai';
import { FaHeart, FaMoon, FaSun } from 'react-icons/fa';
import { Link } from 'react-router-dom'
// import { useNavigate } from "react-router-dom";
import "./Navigation.css";
import { useSelector, useDispatch } from 'react-redux'
// import {useLoginMutation}from "../../../src/redux/api/usersApiSlice";
import {useLogoutMutation} from "../../../src/redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import DropupSidebarMenu from '../../components/DropupSidebarMenu';
import FavoritesCount from "../Products/FavoritesCount";
import PrivateLink from "../../components/PrivateLink"; // adjust the path if needed
import { setFavorites } from "../../redux/features/Favorites/favoriteSlice";
import { selectQtyBadge } from "../../redux/features/cart/cartSelector";


const Navigation = () => {
  
  const { cartItems } = useSelector((state) => state.cart);
const badgeQty = useSelector(selectQtyBadge);
  
  const { userInfo } = useSelector(state => state.auth)
  const dropdownRef = useRef();
  
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [ShowSidebar, setShowSidebar] = useState(false)
    const [isSidebarHovered, setIsSidebarHovered] = useState(false);


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
  // const navigate = useNavigate()

  const [logoutApiCall] = useLogoutMutation()

// 🔐 Handle secure logout: call backend, clear Redux state, redirect to login
const logoutHandler = async () => {
  try {
    await logoutApiCall().unwrap(); // ← POST /api/users/logout  // Call the API
    dispatch(setFavorites([])); // ← Clear favorites state   // Clear favorites from Redux
    dispatch(logout());         // ← Clear auth state + localStorage   // Clear userInfo and token from Redux
    // navigate("/login");         // Redirect to login
    window.location.href = "/login";
  } catch (error) {
    console.error("Logout failed:", error);
  }
};


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
      document.documentElement.style.backgroundColor = "#eff6ff";  // Tailwind's gray-100 ="#f3f4f6";
      document.body.style.backgroundColor = "#eff6ff"; // Tailwind bg-blue-50
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDarkMode = () => {
    setIsDark((prev) => !prev);
  };

  return (
    
    <div
      style={{ zIndex: 999 }}
      className={`
        ${ShowSidebar ? "hidden" : "flex"} xl:flex lg:flex md:hidden sm:hidden
        flex-col justify-between p-4
        ${isDark ? "bg-[#23272f] text-white" : "bg-blue-200 text-black"}
        w-[4%] hover:w-[15%] h-[100vh] fixed group
        `}
        id="navigation-container"
            onMouseEnter={() => setIsSidebarHovered(true)}
      onMouseLeave={() => {
        setIsSidebarHovered(false);
        setDropdownOpen(false);
      }}
            // onMouseLeave={() => setDropdownOpen(false)} // <-- closes dropdown on sidebar mouse leave
      onClick={closeSidebar} // <-- closes sidebar when clicking outside
      ref={dropdownRef} // <-- attach ref to the sidebar container
     >
      <div className="flex flex-col justify-center space-y-4">
        <Link 
          to="/" 
          className="flex items-center transition-transform transform hover:translate-x-2"
        >
          <AiOutlineHome className="mr-2 mt-[3rem] text-blue-950 dark:text-blue-300 dark:hover:text-blue-600" size={26} />
          <span className="hidden nav-item-name mt-[3rem]">Home</span>
        </Link>
        <Link 
          to="/shop" 
          className="flex items-center transition-transform transform hover:translate-x-2"
        >
          <AiOutlineShopping className="mr-2 mt-[3rem] text-blue-950 dark:text-purple-400" size={26} />
          <span className="hidden nav-item-name mt-[3rem]">Shop</span>
        </Link>
        <Link 
          to="/cart" 
          className="flex items-center transition-transform transform hover:translate-x-2"
        >
          <div className="relative mt-[3rem] mr-2">
            <AiOutlineShoppingCart className="text-blue-950 dark:text-green-600" size={26} />
            {badgeQty && (
              <span
                className="absolute -top-3 -right-3 min-w-[1.25rem] rounded-full
                          bg-pink-500 px-1 py-0.5 text-center text-xs font-semibold
                          text-white"
              >
                {badgeQty}
              </span>
            )}
            
            {/* {cartItems.length > 0 && ( */}
              {/* <span className="absolute -top-3 -right-3 text-xs px-1.5 py-0.5 bg-pink-500 text-white rounded-full z-10"> */}
                {/* {cartItems.reduce((a, c) => a + c.qty, 0)} */}
                {/* {totalQty > 99 ? "99+" : totalQty} */}
              {/* </span> */}
            {/* )} */}
          </div>
          <span className="hidden nav-item-name mt-[3rem]">Cart</span>
        </Link>

    <PrivateLink>
      <Link 
        to="/favorites" 
        className="flex items-center transition-transform transform hover:translate-x-2"
      >
        <div className="relative mt-[3rem] mr-2">
          <FaHeart className="text-blue-900 dark:text-pink-600" size={26} />
          <FavoritesCount />
        </div>
        <span className="hidden nav-item-name mt-[3rem]">Favorites</span>
      </Link>
    </PrivateLink>

        {/* Dark mode toggle button as a sidebar button */}
        <button
          onClick={toggleDarkMode}
          className="flex items-center transition-transform transform hover:translate-x-2 mt-[3rem] px-0 py-0 bg-transparent"
          title="Toggle dark mode"
        >
          {!isDark ? (
            <FaMoon className="mr-2 mt-[3rem] text-blue-900" size={26} />
            // <FaMoon className="mr-2 mt-[3rem] text-indigo-800" size={26} />
          ) : (
            <FaSun className="mr-2 mt-[3rem] text-yellow-500" size={26} />
          )}
          <span className="hidden nav-item-name mt-[3rem] whitespace-nowrap overflow-hidden text-ellipsis max-w-[7rem]">
            {!isDark ? "Dark Mode" : "Light Mode"}
          </span>
        </button>
      </div>

      <div className="relative">
        <button
          onClick={toggleDropdown}
          ref={dropdownRef}
          className="flex items-center focus:outline-none group"
        >
          {userInfo ? (
            <span className="relative mr-2">
              {/* Initial (default, hides when sidebar is expanded/hovered) */}
              <span
                className={`
                  flex items-center justify-center bg-[#4394bf]
                  dark:bg-[#353945] text-white
                  text-2xl font-bold rounded-full
                  w-10 h-10 border border-cyan-600 dark:border-white
                  group-hover:w-10 group-hover:h-10
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
                    ${isDark ? "bg-[#353945] text-white border border-white" : "bg-blue-100 text-cyan-700  border border-cyan-500"}
                    text-lg font-semibold rounded-full 
                    w-0 min-w-0 h-10 px-0
                    transition-all duration-150
                    opacity-0
                    group-hover:w-auto group-hover:min-w-[2.5rem] group-hover:px-4 group-hover:opacity-100
                    group-hover:relative group-hover:z-10
                  `}
                >
                  <span style={{ left: 0 }}>
                    {userInfo.username}
                  </span>
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
              stroke={isDark ? "white" : "black"}
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
        <DropupSidebarMenu
          dropdownOpen={dropdownOpen}
          userInfo={userInfo}
          logoutHandler={logoutHandler}
        />
      </div>
          
          {!userInfo && 
                  <ul>
                  <li>
                  <Link 
                      to="/login" 
                      className="flex items-center transition-transform transform 
                        hover:translate-x-2"
                      >
                        <AiOutlineLogin className="mr-2 mt-[3rem] text-green-500" size={26}/>
                        <span className="hidden nav-item-name mt-[3rem]">Login</span> {" "}
                    </Link>
                  </li>
                  <li>
                  <Link 
                      to="/register" 
                      className="flex items-center transition-transform transform 
                        hover:translate-x-2"
                      >
                        <AiOutlineHome className="mr-2 mt-[3rem] text-pink-500" size={26}/>
                        <span className="hidden nav-item-name mt-[3rem]">Register</span> {" "}
                    </Link>
                  </li>
                </ul>
          }

          {!ShowSidebar && (
            <button
              className="fixed top-4 left-4 z-[1000] bg-[#151515] p-2 rounded-lg md:hidden"
              onClick={toggleSidebar}
            >
              <div className="flex flex-col gap-1">
                <div className="w-6 h-0.5 bg-gray-200"></div>
                <div className="w-6 h-0.5 bg-gray-200"></div>
                <div className="w-6 h-0.5 bg-gray-200"></div>
              </div>
            </button>
            )}

            {ShowSidebar && (
              <button
                className="fixed top-4 left-4 z-[1000] bg-[#151515] p-2 rounded-lg md:hidden"
                onClick={toggleSidebar}
              >
                <FaTimes color="white" size={24} />
              </button>
            )}
          </div>
        );
   };


export default Navigation