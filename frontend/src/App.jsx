import {Outlet} from 'react-router-dom';
import Navigation from './pages/Auth/Navigation';
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MainLayout from './components/MainLayout';
// import AdminMenu from './pages/Admin/AdminMenu';


function App() {
  return (
    <div className="flex min-h-screen">
      <Navigation />

      {/* ✅ Main content adjusts based on sidebar width */}
      <div
        className="flex-1 transition-all duration-300 px-1
        pl-[7.5rem] lg:pl-[8rem] xl:pl-[9rem]" // ← adjust this to match sidebar width
      >
        <ToastContainer />
        <MainLayout>
          <main className="py-1">
            <Outlet />
          </main>
        </MainLayout>
      </div>
    </div>
  );
}


export default App
