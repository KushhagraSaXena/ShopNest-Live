import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import {
  MdDashboard,
  MdCategory,
  MdAddBox,
  MdListAlt,
  MdPeople,
  MdShoppingCart,
} from "react-icons/md";

const AdminMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const { userInfo } = useSelector((state) => state.auth);

  // ✅ Close on outside click
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  if (!userInfo?.isAdmin) return null;

  return (
    <>
      {/* ✅ Menu Toggle Button */}
      <button
        className={`z-[9999] fixed top-5 right-5 bg-blue-500 dark:bg-[#151515] border border-blue-400 shadow-md hover:border-blue-500 hover:bg-blue-900 dark:hover:bg-gray-950 dark:border-gray-500 dark:hover:border-gray-400 p-2 rounded-lg`}
        onClick={toggleMenu}
        style={{ transition: "right 0.2s, top 0.2s" }}
      >
        {isMenuOpen ? (
          <FaTimes color="white" size={24} />
        ) : (
          <div className="flex flex-col gap-1">
            <div className="w-6 h-0.5 bg-gray-200"></div>
            <div className="w-6 h-0.5 bg-gray-200"></div>
            <div className="w-6 h-0.5 bg-gray-200"></div>
          </div>
        )}
      </button>

      {/* ✅ Backdrop overlay on small screens */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-[998] md:hidden" />
      )}

      {/* ✅ Slide-down Menu */}
      {isMenuOpen && (
        <section
          ref={menuRef}
          className="z-[9999] dark:bg-[#151515] bg-blue-950 border border-blue-600 dark:border-gray-500 p-4 fixed right-7 top-16 rounded-lg shadow-lg min-w-[220px]
          transition-all duration-300 ease-in-out animate-fade-in-down"
        >
          <ul className="list-none mt-2">
            {[
              {
                to: "/admin/dashboard",
                label: "Admin Dashboard",
                icon: <MdDashboard size={20} />,
              },
              {
                to: "/admin/categorylist",
                label: "Create Category",
                icon: <MdCategory size={20} />,
              },
              {
                to: "/admin/productlist",
                label: "Create Product",
                icon: <MdAddBox size={20} />,
              },
              {
                to: "/admin/allproductslist",
                label: "All Products",
                icon: <MdListAlt size={20} />,
              },
              {
                to: "/admin/userlist",
                label: "Manage Users",
                icon: <MdPeople size={20} />,
              },
              {
                to: "/admin/orderlist",
                label: "Manage Orders",
                icon: <MdShoppingCart size={20} />,
              },
            ].map(({ to, label, icon }) => (
              <li key={to}>
                <NavLink
                  className="flex items-center gap-2 py-2 px-3 mb-3 hover:bg-[#2E2D2D] rounded-sm"
                  to={to}
                  style={({ isActive }) => ({
                    color: isActive ? "greenyellow" : "white",
                  })}
                  onClick={() => setIsMenuOpen(false)} // ✅ close after click
                >
                  {icon} {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
};

export default AdminMenu;
