import { Outlet } from 'react-router-dom';
import Navigation from '../pages/Auth/Navigation'; // ✅ Replace AdminMenu
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MainLayout from '../components/MainLayout'; // ✅ Add MainLayout wrapper

const HomeLayout = () => {
  return (
    <div className="flex min-h-screen">
      <Navigation /> {/* Sidebar Navigation */}
      
      <div className="flex-1 transition-all duration-300 px-1 pl-[7.5rem] lg:pl-[8rem] xl:pl-[9rem]">
        <MainLayout>
          <main className="py-1">
            <Outlet />
          </main>
        </MainLayout>
      </div>

      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default HomeLayout;
