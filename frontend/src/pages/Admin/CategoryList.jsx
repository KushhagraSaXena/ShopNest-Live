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
  const { data: categories, refetch } = useListCategoriesQuery();
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
      if (result?.error) {
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

    const stillExists = categories?.find(c => c._id === selectedCategory?._id);
    if (!stillExists) {
      toast.error("This category no longer exists.");
      setModalVisible(false);
      setSelectedCategory(null);
      return;
    }

    if (!updatingName) return toast.error("Category name is required");

    try {
      const result = await updateCategory({
        categoryId: selectedCategory._id,
        updatedCategory: { name: updatingName },
      }).unwrap();

      toast.success(`${result.name || "Category"} updated`);
      setSelectedCategory(null);
      setUpdatingName("");
      setModalVisible(false);
      refetch();
    } catch (error) {
      toast.error(error?.status === 404 ? "Category not found." : "Update failed.");
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory?._id) {
      toast.error("No category selected.");
      return;
    }

    try {
      const result = await deleteCategory(selectedCategory._id).unwrap();
      toast.success(`${result.name} deleted.`);
      setModalVisible(false);
      setSelectedCategory(null);
      setUpdatingName("");
      refetch();
    } catch (error) {
      toast.error("Deletion failed.");
    }
  };

  return (
    <main className="w-full min-h-screen bg-blue-50 dark:bg-[#111827] py-6">
      <Helmet>
        <title>Manage Categories | Admin Panel</title>
        <meta name="description" content="Add, update or delete product categories in your store." />
      </Helmet>

      <div className="max-w-screen-xl mx-auto px-4 md:px-8 flex flex-col md:flex-row">
        <AdminMenu />

        <div className="w-full md:w-3/4 p-3">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Manage Categories
          </h1>

          <CategoryForm
            value={name}
            setValue={setName}
            handleSubmit={handleCreateCategory}
          />

          <hr className="my-6 border-t-2 border-gray-300 dark:border-gray-700" />

          <div className="flex flex-wrap gap-3">
            {categories?.map((category) => {
              const isSelected = selectedCategory?._id === category._id;

              return (
                <button
                  key={category._id}
                  onClick={() => {
                    setModalVisible(true);
                    setSelectedCategory(category);
                    setUpdatingName(category.name);
                  }}
                  className={`py-2 px-4 rounded-lg border focus:outline-none transition-all duration-150
                    ${
                      isSelected
                        ? "bg-blue-500 text-white dark:bg-pink-600 dark:text-white"
                        : "bg-blue-100 dark:bg-[#1f2937] text-black dark:text-pink-400 border-blue-400 dark:border-pink-600 hover:bg-blue-500 hover:text-white dark:hover:bg-pink-600 dark:hover:text-white"
                    }`}
                >
                  {category.name}
                </button>
              );
            })}
          </div>

          <Modal
            isOpen={modalVisible}
            onClose={() => {
              setModalVisible(false);
              setSelectedCategory(null);
              setUpdatingName("");
            }}
          >
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
    </main>
  );
};

export default CategoryList;
