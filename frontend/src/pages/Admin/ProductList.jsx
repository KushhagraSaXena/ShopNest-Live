import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useListCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";

const ProductList = () => {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useListCategoriesQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return toast.error("Product name is required.");
    if (name.length < 3)
      return toast.error("Product name must be at least 3 characters.");
    if (!price) return toast.error("Price is required.");
    if (isNaN(price)) return toast.error("Price must be a number.");
    if (Number(price) <= 0)
      return toast.error("Price must be greater than 0.");
    if (!description.trim()) return toast.error("Description is required.");
    if (description.length < 5)
      return toast.error("Description must be at least 5 characters.");
    if (!category) return toast.error("Please choose a category.");
    if (!quantity) return toast.error("Quantity is required.");
    if (isNaN(quantity)) return toast.error("Quantity must be a number.");
    if (Number(quantity) < 1)
      return toast.error("Quantity must be at least 1.");
    if (!brand.trim()) return toast.error("Brand is required.");
    if (brand.length < 2)
      return toast.error("Brand name must be at least 2 characters.");
    if (!countInStock && countInStock !== 0)
      return toast.error("Stock count is required.");
    if (isNaN(countInStock))
      return toast.error("Stock count must be a number.");
    if (Number(countInStock) < 0)
      return toast.error("Stock count cannot be negative.");
    if (!image) return toast.error("Please upload a product image.");

    try {
      const productData = new FormData();
      productData.append("image", image);
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("brand", brand);
      productData.append("countInStock", countInStock);

      const response = await createProduct(productData).unwrap();
      toast.success(`${response.name} is created successfully!`);
      navigate("/");
    } catch (error) {
      toast.error(error?.data?.message || "Product creation failed.");
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
      setImageUrl(res.image);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <div className="container xl:mx-[9rem] sm:mx-0 px-4 py-6">
      <div className="flex flex-col md:flex-row">
        <AdminMenu />
        <div className="md:w-3/4 p-3">
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-300 mb-4">
            Create Products
          </div>

          {imageUrl && (
            <div className="text-center">
              <img
                src={imageUrl}
                alt="product"
                className="block mx-auto max-h-[200px]"
              />
            </div>
          )}

          <div className="mb-3">
            <label className="border dark:text-white text-black dark:bg-transparent bg-blue-50 px-4 w-full text-center rounded-lg cursor-pointer font-bold py-11 flex justify-center items-center relative">
              {image ? image.name : "Upload Image"}
              <span className="mx-1 text-red-500">*</span>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={uploadFileHandler}
                className={!image ? "hidden" : ""}
              />
            </label>
          </div>

          <form onSubmit={handleSubmit} className="p-3">
            <div className="flex flex-wrap gap-4">
              <div>
                <label htmlFor="name">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="p-4 mb-3 w-full max-w-md border rounded-lg dark:bg-[#101011] bg-blue-50 text-black dark:text-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="price">
                  Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  className="p-4 mb-3 w-full max-w-md border rounded-lg dark:bg-[#101011] bg-blue-50 text-black dark:text-white"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <div>
                <label htmlFor="quantity">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  className="p-4 mb-3 w-full max-w-md border rounded-lg dark:bg-[#101011] bg-blue-50 text-black dark:text-white"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="brand">
                  Brand <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="p-4 mb-3 w-full max-w-md border rounded-lg dark:bg-[#101011] bg-blue-50 text-black dark:text-white"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>
            </div>

            <label htmlFor="description">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              className="p-4 mb-3 w-full border rounded-lg dark:bg-[#101011] bg-blue-50 text-black dark:text-white"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>

            <div className="flex flex-wrap gap-4">
              <div>
                <label htmlFor="countInStock">
                  Count In Stock <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="p-4 mb-3 w-full max-w-md border rounded-lg dark:bg-[#101011] bg-blue-50 text-black dark:text-white"
                  value={countInStock}
                  onChange={(e) => setCountInStock(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="category">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="p-4 mb-3 w-full max-w-md border rounded-lg dark:bg-[#101011] bg-blue-50 text-black dark:text-white"
                >
                  <option value="" disabled>
                    -- Choose a category --
                  </option>
                  {categories?.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="py-4 px-10 mt-5 rounded-lg text-lg font-bold bg-pink-600 text-white hover:bg-pink-700 transition"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
