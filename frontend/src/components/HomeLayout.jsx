import AdminMenu from '../pages/Admin/AdminMenu';
import App from '../App'; 

const HomeLayout = () => {
  return (
    <div className="flex">
      <AdminMenu />
      <div className="flex-1">
        <App />
      </div>
    </div>
  );
};

export default HomeLayout;
