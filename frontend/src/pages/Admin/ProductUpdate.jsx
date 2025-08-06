import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation
} from '../../redux/api/productApiSlice';
import { useListCategoriesQuery } from '../../redux/api/categoryApiSlice';
import { toast } from 'react-toastify';
import AdminMenu from './AdminMenu';
import { FaTrashAlt, FaArrowCircleUp } from "react-icons/fa";
import { Helmet } from 'react-helmet-async';

const ProductUpdate = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { data: productData, refetch } = useGetProductByIdQuery(params.id);
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const { data: categories = [] } = useListCategoriesQuery();
  const [uploadProductImage] = useUploadProductImageMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    if (productData && productData._id && categories.length > 0) {
      setName(productData.name);
      setDescription(productData.description);
      setPrice(productData.price);
      setQuantity(productData.quantity);
      setBrand(productData.brand);
      setCountInStock(productData.countInStock);
      setImage(productData.image);
      // ✅ Handle category if it's an object or a string
      if (typeof productData.category === "object" && productData.category?._id) {
        setCategory(productData.category._id);
      } else if (typeof productData.category === "string") {
        setCategory(productData.category);
      } else {
        setCategory("");
      }
    }
  }, [productData, categories]);

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    const data = await uploadProductImage(formData).unwrap();
    setImage(data.image); // ✅ already a string URL (e.g., /uploads/file.jpg)
    try {
      const data = await uploadProductImage(formData).unwrap();
      toast.success("Item added successfully");
      setImage(data.image);
    } catch (err) {
      toast.success("Item added successfully");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ VALIDATION SECTION
    if (!name.trim()) return toast.error("Product name is required.");
    if (name.length < 3) return toast.error("Product name must be at least 3 characters.");
    if (!price) return toast.error("Price is required.");
    if (isNaN(price)) return toast.error("Price must be a number.");
    if (Number(price) <= 0) return toast.error("Price must be greater than 0.");
    if (!description.trim()) return toast.error("Description is required.");
    if (description.length < 5) return toast.error("Description must be at least 5 characters.");
    if (!category) return toast.error("Please choose a category before submitting.");
    if (!quantity) return toast.error("Quantity is required.");
    if (isNaN(quantity)) return toast.error("Quantity must be a number.");
    if (Number(quantity) < 1) return toast.error("Quantity must be at least 1.");
    if (!brand.trim()) return toast.error("Brand is required.");
    if (brand.length < 2) return toast.error("Brand name must be at least 2 characters.");
    if (!countInStock && countInStock !== 0) return toast.error("Stock count is required.");
    if (isNaN(countInStock)) return toast.error("Stock count must be a number.");
    if (Number(countInStock) < 0) return toast.error("Stock count cannot be negative.");
    if (!image) return toast.error("Please upload a product image.");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("quantity", quantity);
      formData.append("brand", brand);
      formData.append("countInStock", countInStock);
      
      if (typeof image !== "string") {
        formData.append("image", image);
      } else {
        formData.append("image", image); // it’s already a URL string
      }

      const data = await updateProduct({ productId: params.id, formData }).unwrap();

    // ✅ This part runs only if backend sends a real response
    if (data?.error) {
      toast.error(data.error);
    } else {
      toast.success(`"${data.name}" updated successfully!`);
      // await refetch(); // Refetch product data to update the UI
      navigate("/admin/allproductslist");
    }
  } catch (err) {
    toast.info("⚠️ No response received from server. Try again.");
  }
};

  const handleDelete = async () => {
    try {
      const answer = window.confirm("Are you sure you want to delete this product?");
      if (!answer) return;
      if (!params.id) return toast.error("Invalid product ID.");
      const data = await deleteProduct(params.id).unwrap();
      toast.success(`"${data.name}" is deleted`);
      navigate("/admin/allproductslist");
    } catch (err) {
      toast.error("Delete failed. Try again.");
    }
  };

  return (
    <>
      <Helmet>
        <title>Update Product - Admin</title>
        <meta name="description" content="Update or delete a product from the inventory" />
      </Helmet>

      <div className="container xl:mx-[9rem] sm:mx-0 px-4 py-6">
        <div className="flex flex-col md:flex-row">
          <AdminMenu />
          <div className="md:w-3/4 p-3">
            <div className="h-12 font-bold text-gray-900 dark:text-white mb-4">
              Update / Delete Product
            </div>

            {image && (
              <div className="text-center mb-4">
                <img src={image} alt="product" className="block mx-auto max-h-[200px]" />
              </div>
            )}

            <div className="mb-4">
              <label className="w-full px-4 py-10 text-center font-bold text-gray-700 dark:text-white bg-blue-100 dark:bg-transparent 
                border border-black dark:border-gray-600 rounded-lg cursor-pointer flex justify-center items-center relative 
                focus-within:border-blue-900 dark:focus-within:border-blue-700 focus-within:border-opacity-60 transition">
                {image ? image.name : "Upload Image"}
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={uploadFileHandler}
                  className={!image ? "hidden" : "text-gray-600 dark:text-white"}
                />
              </label>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[260px]">
                  <label className="block font-medium mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full p-4 border rounded-lg dark:bg-[#101011] bg-blue-50 text-gray-800 dark:text-white"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="flex-1 min-w-[260px]">
                  <label className="block font-medium mb-1">Price</label>
                  <input
                    type="number"
                    className="w-full p-4 border rounded-lg dark:bg-[#101011] bg-blue-50 text-gray-800 dark:text-white"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[260px]">
                  <label className="block font-medium mb-1">Quantity</label>
                  <input
                    type="number"
                    className="w-full p-4 border rounded-lg dark:bg-[#101011] bg-blue-50 text-gray-800 dark:text-white"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>

                <div className="flex-1 min-w-[260px]">
                  <label className="block font-medium mb-1">Brand</label>
                  <input
                    type="text"
                    className="w-full p-4 border rounded-lg dark:bg-[#101011] bg-blue-50 text-gray-800 dark:text-white"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">Description</label>
                <textarea
                  className="w-full p-4 border rounded-lg dark:bg-[#101011] bg-blue-50 text-gray-800 dark:text-white"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[260px]">
                  <label className="block font-medium mb-1">Count In Stock</label>
                  <input
                    type="text"
                    className="w-full p-4 border rounded-lg dark:bg-[#101011] bg-blue-50 text-gray-800 dark:text-white"
                    value={countInStock}
                    onChange={(e) => setCountInStock(e.target.value)}
                  />
                </div>

                <div className="flex-1 min-w-[260px]">
                  <label className="block font-medium mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-4 border rounded-lg dark:bg-[#101011] bg-blue-50 text-gray-800 dark:text-white"
                  >
                    {!category && <option value="">-- Choose Category --</option>}
                    {categories?.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-4">
                <button
                  type="submit"
                  className="flex items-center gap-2 py-3 px-8 rounded-lg text-lg font-bold bg-blue-600 text-white hover:bg-blue-700 transition dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-green-700 focus:ring-opacity-50"
                >
                  <FaArrowCircleUp />
                  Update
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex items-center gap-2 py-3 px-8 rounded-lg text-lg font-bold bg-red-500 text-white hover:bg-red-600 transition  dark:bg-pink-600 dark:hover:bg-pink-700"
                >
                  <FaTrashAlt />
                  Delete
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductUpdate;