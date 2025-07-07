import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { setCredientials } from "../../redux/features/auth/authSlice";
import { Link } from "react-router-dom";
import { useProfileMutation } from '../../redux/api/usersApiSlice';
import MainLayout from "../../components/MainLayout"; 


const Profile = () => {
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { userInfo } = useSelector(state => state.auth);
  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();

  const dispatch = useDispatch();

  useEffect(() => {
    setUserName(userInfo.username);
    setEmail(userInfo.email);
  }, [userInfo.username, userInfo.email]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          username,
          email,
          password,
        }).unwrap();
        dispatch(setCredientials({ ...res }));
        toast.success("Profile updated successfully");
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    }
  };

  return (
    <MainLayout>
    <section className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-gray-900 px-4 py-10">
      <div className="w-full max-w-md p-6 rounded-lg shadow-md bg-gray-100 dark:bg-[#23272f]">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white text-center">
          Update Profile
        </h2>
        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label className="block text-gray-800 dark:text-gray-200 mb-2">Name</label>
            <input
              type="text"
              placeholder="Enter name"
              className="p-3 rounded-sm w-full border border-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 bg-white dark:bg-transparent text-gray-900 dark:text-white"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-800 dark:text-gray-200 mb-2">Email Address</label>
            <input
              type="email"
              placeholder="Enter email"
              className="p-3 rounded-sm w-full border border-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 bg-white dark:bg-transparent text-gray-900 dark:text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-800 dark:text-gray-200 mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              className="p-3 rounded-sm w-full border border-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 bg-white dark:bg-transparent text-gray-900 dark:text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-800 dark:text-gray-200 mb-2">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm password"
              className="p-3 rounded-sm w-full border border-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 bg-white dark:bg-transparent text-gray-900 dark:text-white"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded"
            >
              Update
            </button>
            <Link
              to="/user-orders"
              className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-4 rounded"
            >
              My Orders
            </Link>
          </div>
          {loadingUpdateProfile && <Loader />}
        </form>
      </div>
    </section>
    </MainLayout>

  );
};

export default Profile;
