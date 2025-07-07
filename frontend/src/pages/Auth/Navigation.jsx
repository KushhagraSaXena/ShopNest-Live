import { useState, useEffect, useRef } from "react";
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
import DropupSidebarMenu from '../../components/DropupSidebarMenu';
import FavoritesCount from "../Products/FavoritesCount";
import PrivateLink from "../../components/PrivateLink"; // adjust the path if needed
import { setFavorites } from "../../redux/features/Favorites/favoriteSlice";


const Navigation = () => {

  // const { cartItems } = useSelector((state) => state.cart);


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
  const navigate = useNavigate()

  const [logoutApiCall] = useLogoutMutation()

  const logoutHandler = async () => {
  try {
    await logoutApiCall().unwrap();          // Call the API
    dispatch(setFavorites([]));              // Clear favorites from Redux
    dispatch(logout());                      // Clear userInfo and token from Redux
    navigate("/login");                      // Redirect to login
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
      document.documentElement.style.backgroundColor = "#f3f4f6"; // Tailwind's gray-100
      document.body.style.backgroundColor = "#f3f4f6";
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
        ${isDark ? "bg-[#23272f] text-white" : "bg-black text-white"}
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
          <AiOutlineHome className="mr-2 mt-[3rem]" size={26} />
          <span className="hidden nav-item-name mt-[3rem]">Home</span>
        </Link>
        <Link 
          to="/shop" 
          className="flex items-center transition-transform transform hover:translate-x-2"
        >
          <AiOutlineShopping className="mr-2 mt-[3rem]" size={26} />
          <span className="hidden nav-item-name mt-[3rem]">Shop</span>
        </Link>
        <Link 
          to="/cart" 
          className="flex items-center transition-transform transform hover:translate-x-2"
        >
          <AiOutlineShoppingCart className="mr-2 mt-[3rem]" size={26}/>
          <span className="hidden nav-item-name mt-[3rem]">Cart</span>
        </Link>

         {/* <div className="absolute top-9">
            {cartItems.length > 0 && (
              <span>
                <span className="px-1 py-0 text-sm text-white bg-pink-500 rounded-full">
                  {cartItems.reduce((a, c) => a + c.qty, 0)}
                </span>
              </span>
            )}
          </div> */}

        <PrivateLink>
        <Link 
          to="/favorites" 
          className="flex items-center transition-transform transform hover:translate-x-2"
        >
          <FaHeart className="mr-2 mt-[3rem]" size={26}/>
          <span className="hidden nav-item-name mt-[3rem]">Favorites</span>{" "}
          <FavoritesCount />
        </Link>
        </PrivateLink>
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
          ref={dropdownRef}
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