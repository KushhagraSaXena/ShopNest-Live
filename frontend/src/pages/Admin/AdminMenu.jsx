import { useState } from "react";
import { useSelector } from 'react-redux';
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
    const { userInfo } = useSelector((state) => state.auth);
      if (!userInfo?.isAdmin) return null; 


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
 return (
    <>
      <button
        className={`z-50 fixed top-5 right-7 bg-[#151515] p-2 rounded-lg`}
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

      {isMenuOpen && (
        <section className="z-40 bg-[#151515] p-4 fixed right-7 top-16 rounded-lg shadow-lg min-w-[220px]">
          <ul className="list-none mt-2">
            <li>
              <NavLink
                className="list-item  items-center gap-2 py-2 px-3  mb-5 hover:bg-[#2E2D2D] rounded-sm"
                to="/admin/dashboard"
                style={({ isActive }) => ({
                  color: isActive ? "greenyellow" : "white",
                })}
              >
                <MdDashboard size={20} /> Admin Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                className="list-item  items-center gap-2 py-2 px-3  mb-5 hover:bg-[#2E2D2D] rounded-sm"
                to="/admin/categorylist"
                style={({ isActive }) => ({
                  color: isActive ? "greenyellow" : "white",
                })}
              >
                <MdCategory size={20} /> Create Category
              </NavLink>
            </li>
            <li>
              <NavLink
                className="list-item  items-center gap-2 py-2 px-3  mb-5 hover:bg-[#2E2D2D] rounded-sm"
                to="/admin/productlist"
                style={({ isActive }) => ({
                  color: isActive ? "greenyellow" : "white",
                })}
              >
                <MdAddBox size={20} /> Create Product
              </NavLink>
            </li>
            <li>
              <NavLink
                className="list-item  items-center gap-2 py-2 px-3  mb-5 hover:bg-[#2E2D2D] rounded-sm"
                to="/admin/allproductslist"
                style={({ isActive }) => ({
                  color: isActive ? "greenyellow" : "white",
                })}
              >
                <MdListAlt size={20} /> All Products
              </NavLink>
            </li>
            <li>
              <NavLink
                className="list-item  items-center gap-2 py-2 px-3  mb-5 hover:bg-[#2E2D2D] rounded-sm"
                to="/admin/userlist"
                style={({ isActive }) => ({
                  color: isActive ? "greenyellow" : "white",
                })}
              >
                <MdPeople size={20} /> Manage Users
              </NavLink>
            </li>
            <li>
              <NavLink
                className="list-item  items-center gap-2 py-2 px-3  mb-5 hover:bg-[#2E2D2D] rounded-sm"
                to="/admin/orderlist"
                style={({ isActive }) => ({
                  color: isActive ? "greenyellow" : "white",
                })}
              >
                <MdShoppingCart size={20} /> Manage Orders
              </NavLink>
            </li>
          </ul>
        </section>
      )}
    </>
  );
};

export default AdminMenu;