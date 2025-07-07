import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaBoxOpen, 
  FaThLarge, 
  FaClipboardList, 
  FaUsers, 
  FaUser, 
  FaSignOutAlt 
} from 'react-icons/fa';

const DropupSidebarMenu = ({
  dropdownOpen,
  userInfo,
  logoutHandler
}) => {
  if (!dropdownOpen || !userInfo) return null;

  return (
    <ul className={`absolute right-0 mt-0 mr-0 space-y-2 bg-[#18181b] text-gray-50 
      ${!userInfo.isAdmin ? "-top-20" : "-top-80"}
    `}>
      {userInfo.isAdmin && (
        <>
          <li>
            <Link
              to="/admin/dashboard"
              className="px-4 py-2 hover:bg-[#1e2129] flex items-center"
            >
              <FaTachometerAlt className="mr-2" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/admin/productlist"
              className=" px-4 py-2 hover:bg-[#1e2129] flex items-center"
            >
              <FaBoxOpen className="mr-2" />
              Products
            </Link>
          </li>
          <li>
            <Link
              to="/admin/categorylist"
              className=" px-4 py-2 hover:bg-[#1e2129] flex items-center"
            >
              <FaThLarge className="mr-2" />
              Category
            </Link>
          </li>
          <li>
            <Link
              to="/admin/orderlist"
              className=" px-4 py-2 hover:bg-[#1e2129] flex items-center"
            >
              <FaClipboardList className="mr-2" />
              Orders
            </Link>
          </li>
          <li>
            <Link
              to="/admin/userlist"
              className=" px-4 py-2 hover:bg-[#1e2129] flex items-center"
            >
              <FaUsers className="mr-2" />
              Users
            </Link>
          </li>
        </>
      )}
      <li>
        <Link
          to="/profile"
          className=" px-4 py-2 hover:bg-[#1e2129] flex items-center"
        >
          <FaUser className="mr-2" />
          Profile
        </Link>
      </li>
      <li>
        <Link
          to="/admin/logout"
          onClick={logoutHandler}
          className=" px-4 py-2 hover:bg-[#1e2129] flex items-center"
        >
          <FaSignOutAlt className="mr-2" />
          Logout
        </Link>
      </li>
    </ul>
  );
};

export default DropupSidebarMenu;
