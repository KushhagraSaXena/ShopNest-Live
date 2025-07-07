import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import CategoryForm from "../../components/CategoryForm";
import AdminMenu from "./AdminMenu";
import Modal from "../../components/Modal";

import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useListCategoriesQuery,
} from '../../redux/api/categoryApiSlice';

const CategoryList = () => {
  const { data: categories, refetch, isLoading, error } = useListCategoriesQuery();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo?.isAdmin) {
      refetch();
    }
  }, [userInfo, refetch]);

  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!name) return toast.error("Category name is required");
    try {
      const result = await createCategory({ name }).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        setName("");
        toast.success(`${result.name} is created.`);
        refetch();
      }
    } catch (error) {
      toast.error("Creating category failed, try again.");
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!selectedCategory || !selectedCategory._id) return toast.error("No category selected for update.");
    if (!updatingName) return toast.error("Category name is required");

    try {
      const result = await updateCategory({
        categoryId: selectedCategory._id,
        updatedCategory: { name: updatingName },
      }).unwrap();

      toast.success(`${result.name || "Category"} is updated`);
      setSelectedCategory(null);
      setUpdatingName("");
      setModalVisible(false);
      refetch();
    } catch (error) {
      toast.error(error?.status === 404 ? "Category not found." : "Failed to update category.");
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory || !selectedCategory._id) {
      toast.error("No category selected for deletion.");
      setModalVisible(false);
      setSelectedCategory(null);
      setUpdatingName("");
      return;
    }

    try {
      const result = await deleteCategory(selectedCategory._id).unwrap();
      toast.success(`${result.name} is deleted.`);
      setSelectedCategory(null);
      setModalVisible(false);
      refetch();
    } catch (error) {
      toast.error("Category deletion failed. Try again.");
    }
  };

  return (
    <div className="container xl:mx-[9rem] sm:mx-0 py-6 bg-blue-50 dark:bg-[#111827] ">
      <div className="min-h-screen bg-blue-50 dark:bg-[#111827] sm:px-4 md:px-6">
        <Helmet>
          <title>Manage Categories | Admin Panel</title>
          <meta name="description" content="Add, update or delete product categories in your store." />
        </Helmet>

      <div className="flex flex-col md:flex-row">
        <AdminMenu />
        <div className="w-full md:w-3/4 p-3">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Manage Categories</h1>

          <CategoryForm
            value={name}
            setValue={setName}
            handleSubmit={handleCreateCategory}
          />

          <hr className="my-6 border-t-2 border-gray-300 dark:border-gray-700" />

          <div className="flex flex-wrap gap-3">
            {categories?.map((category) => (
              <div key={category._id}>
                <button
                  className="bg-blue-100 dark:bg-[#1f2937] text-black dark:text-pink-400 border border-blue-300 dark:border-pink-600 hover:bg-blue-200 dark:hover:bg-pink-600 hover:text-black dark:hover:text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
                  onClick={() => {
                    setModalVisible(true);
                    setSelectedCategory(category);
                    setUpdatingName(category.name);
                  }}
                >
                  {category.name}
                </button>
              </div>
            ))}
          </div>

          <Modal isOpen={modalVisible} onClose={() => {
            setModalVisible(false);
            setSelectedCategory(null);
            setUpdatingName("");
          }}>
            <CategoryForm
              value={updatingName}
              setValue={setUpdatingName}
              handleSubmit={handleUpdateCategory}
              buttonText="Update"
              handleDelete={handleDeleteCategory}
            />
          </Modal>
        </div>
      </div>
    </div>
    </div>
  );
};

export default CategoryList;
