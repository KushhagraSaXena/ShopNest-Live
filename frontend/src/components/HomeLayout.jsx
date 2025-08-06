import { Outlet } from 'react-router-dom';
import AdminMenu from '../pages/Admin/AdminMenu';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HomeLayout = () => {
  return (
    <div className="flex min-h-screen">
      <AdminMenu />
      <div className="flex-1">
        <Outlet /> {/* ✅ Needed for routing to work */}
      </div>
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default HomeLayout;
