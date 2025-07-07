import {Outlet} from 'react-router-dom';
import Navigation from './pages/Auth/Navigation';
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MainLayout from './components/MainLayout';
// import AdminMenu from './pages/Admin/AdminMenu';


function App() {
  
 return (
    <>
      <ToastContainer />
      <Navigation />
      <MainLayout>
              {/* <AdminMenu />  */}
        <main className="py-1">
          <Outlet />
        </main>
      </MainLayout>
    </>
  );
}

export default App
