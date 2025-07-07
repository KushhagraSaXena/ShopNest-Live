import { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaCheck } from 'react-icons/fa';
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import { useGetUsersQuery, useUpdateUserMutation, useDeleteUserMutation } from "../../redux/api/usersApiSlice";
import Message from "../../components/Message";
import MainLayout from "../../components/MainLayout";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/features/auth/authSlice";
import AdminMenu from "./AdminMenu";


const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");
  const [editableUserRole, setEditableUserRole] = useState("");

  useEffect(() => {
   if (error) {
      toast.error("Failed to fetch users. Please try again later.");
    }
    refetch();
  }, [error, refetch]);

  // Start editing a user
  const handleEdit = (user) => {
    setEditableUserId(user._id);
    setEditableUserName(user.username);
    setEditableUserEmail(user.email);
    setEditableUserRole(user.isAdmin ? "admin" : "user");
  };

  // Save updated user
  const updateHandler = async (userId) => {
    try {
      await updateUser({
        id: userId,
        username: editableUserName,
        email: editableUserEmail,
        isAdmin: editableUserRole === "admin"
      }).unwrap();

      // If the current user changed their own role from admin to user, log them out
      if (
        userId === userInfo._id &&
        userInfo.isAdmin &&
        editableUserRole !== "admin"
      ) {
        dispatch(logout());
        toast.info("Your role was changed. Please log in again.");
        setEditableUserId(null);
        return;
      }

      toast.success("User updated successfully");
      setEditableUserId(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update user");
    }
  };

  // Delete user
  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId).unwrap();
        toast.success("User deleted successfully");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || "Failed to delete user");
      }
    }
  };

  return (
    <MainLayout> {/* This wraps the entire page */}
    <AdminMenu />
    
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Users</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.message}</Message>
      ) : (
        <div className="flex flex-col md:flex-row">
          <table className="w-full md:w-4/5 mx-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">NAME</th>
                <th className="px-4 py-2 text-left">EMAIL</th>
                <th className="px-4 py-2 text-left">ROLE</th>
                <th className="px-4 py-2 text-left">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {[...(users?.filter(user => user.isAdmin) || []), ...(users?.filter(user => !user.isAdmin) || [])].map((user, idx) => (
                <tr
                  key={user._id}
                  className={`${
                    idx % 2 === 0
                      ? "bg-white dark:bg-[#23272f]"
                      : "bg-gray-50 dark:bg-[#18181b]"
                  } border-b border-gray-200 dark:border-gray-700`}
                >
                  <td className="px-4 py-2">{user._id}</td>
                  <td className="px-4 py-2">
                    {editableUserId === user._id ? (
                      <input
                        type="text"
                        value={editableUserName}
                        onChange={(e) => setEditableUserName(e.target.value)}
                       className="border border-gray-300 rounded px-2 py-1 w-52" // Decreased width

                        // className="w-full p-2 border rounded-lg"
                        
                      />
                    ) : (
                      user.username
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editableUserId === user._id ? (
                      <input
                        type="text"
                        value={editableUserEmail}
                        onChange={(e) => setEditableUserEmail(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 w-82" // Increased width
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editableUserId === user._id ? (
                      <select
                        value={editableUserRole}
                        onChange={(e) => setEditableUserRole(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    ) : (
                      user.isAdmin ? "admin" : "user"
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex flex-row space-x-2">
                      {editableUserId === user._id ? (
                        <>
                          <button
                            onClick={() => updateHandler(user._id)}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                          >
                            <FaCheck />
                          </button>
                          {/* Keep delete button always in the same position */}
                          {!user.isAdmin && (
                            <button
                              onClick={() => handleDelete(user._id)}
                              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(user)}
                            className="text-blue-500 hover:underline bg-white border border-blue-500 font-bold py-2 px-4 rounded transition-shadow duration-200 focus:outline-none hover:shadow-blue-400 hover:shadow-md"
                          >
                            <FaEdit />
                          </button>
                          {!user.isAdmin && (
                            <button
                              onClick={() => handleDelete(user._id)}
                              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </MainLayout>

  );
};

export default UserList;