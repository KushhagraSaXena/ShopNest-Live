import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation
} from '../../redux/api/productApiSlice'
import { useListCategoriesQuery } from '../../redux/api/categoryApiSlice'
import { toast } from 'react-toastify'
import AdminMenu from './AdminMenu'

import { FaTrashAlt, FaArrowCircleUp } from "react-icons/fa";


const ProductUpdate = () => {
  const params = useParams()
  const navigate = useNavigate()
  const { data: productData, refetch } = useGetProductByIdQuery(params.id)
  const [image, setImage] = useState(productData ? productData.image : "")
  const [name, setName] = useState(productData ? productData.name : "")
  const [description, setDescription] = useState(productData ? productData.description : "")
  const [price, setPrice] = useState(productData ? productData.price : "")
  const [category, setCategory] = useState(productData ? productData.category : "")
  const [quantity, setQuantity] = useState(productData ? productData.quantity : "")
  const [brand, setBrand] = useState(productData ? productData.brand : "")
  const [countInStock, setCountInStock] = useState(productData ? productData.countInStock : 0)

  const { data: categories = [] } = useListCategoriesQuery()
  const [uploadProductImage] = useUploadProductImageMutation()
  const [updateProduct] = useUpdateProductMutation()
  const [deleteProduct] = useDeleteProductMutation()
  useEffect(() => {
  if (
    productData &&
    productData._id &&
    categories.length > 0
  ) {
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
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success("Item added successfully", {
        position: "top-right",
        autoClose: 2000,
      });
      setImage(res.image);
    } catch (err) {
      toast.success("Item added successfully", {
        position: "top-right",
        autoClose: 2000,
      });
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

      // ✅ PLACE IT HERE
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

    // Validation check
  // if (!name || !description || !price || !category) {
  //   toast.error("All required fields must be filled.", {
  //     position: "top-right",
  //     autoClose: 2000,
  //   });
  //   return;
  // }
    // ✅ IF VALIDATION PASSES, CONTINUE TO UPDATE API

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("quantity", quantity);
      formData.append("brand", brand);
      formData.append("countInStock", countInStock);

      // Update product using the RTK Query mutation
      const data = await updateProduct({ productId: params.id, formData });

      if (data?.error) {
        toast.error(data.error, {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        toast.success(`Product successfully updated`, {
          position: "top-right",
          autoClose: 2000,
        });
        navigate("/admin/allproductslist");
      }
    } catch (err) {
      console.log(err);
      toast.error("Product update failed. Try again.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleDelete = async () => {
    try {
      let answer = window.confirm(
        "Are you sure you want to delete this product?"
      );
      if (!answer) return;
        if (!params.id) {
  toast.error("Invalid product ID.");
  return;
}

      // const { data } = await deleteProduct(params.id);
      const data = await deleteProduct(params.id).unwrap(); //No destructuring needed, because data is already the result.
      toast.success(`"${data.name}" is deleted`, {
        position: "top-right",
        autoClose: 2000,
      });
      navigate("/admin/allproductslist");
    } catch (err) {
      console.log(err);
      toast.error("Delete failed. Try again.", {
position: "top-right",
        autoClose: 2000,
      });
    }
  };


  return (
    <>
      <div className="container  xl:mx-[9rem] sm:mx-[0]">
        <div className="flex flex-col md:flex-row">
          <AdminMenu />
          <div className="md:w-3/4 p-3">
            <div className="h-12">Update / Delete Product</div>

            {/*  */}

            {image && (
              <div className="text-center">
                <img
                  src={image}
                  alt="product"
                  className="block mx-auto max-h-[200px]"
                />
              </div>
            )}

            <div className="mb-3">
              <label className="border text-white px-4 w-full text-center rounded-lg cursor-pointer font-bold py-11 flex justify-center items-center relative">
                {image ? image.name : "Upload Image"}
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={uploadFileHandler}
                  className={!image ? "hidden" : "text-white"}
                />
              </label>
            </div>



            {/* 
            {image && (
              <div className="text-center">
                <img
                  src={image}
                  alt="product"
                  className="block mx-auto w-full h-[40%]"
                />
              </div>
            )}

            <div className="mb-3">
              <label className="text-white  px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11">
                {image ? image.name : "Upload image"}
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={uploadFileHandler}
                  className="text-white"
                />
              </label>
            </div> */}

            <div className="p-3">
              <div className="flex flex-wrap">
                <div className="one">
                  <label htmlFor="name">Name</label> <br />
                  <input
                    type="text"
                    className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white mr-[5rem]"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="two">
                  <label htmlFor="name block">Price</label> <br />
                  <input
                    type="number"
                    className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white "
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-wrap">
                <div>
                  <label htmlFor="name block">Quantity</label> <br />
                  <input
                    type="number"
                    min="1"
                    className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white mr-[5rem]"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="name block">Brand</label> <br />
                  <input
                    type="text"
                    className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white "
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  />
                </div>
              </div>

              <label htmlFor="" className="my-5">
                Description
              </label>
              <textarea
                type="text"
                className="p-2 mb-3 bg-[#101011]  border rounded-lg w-[95%] text-white"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <div className="flex justify-between">
                <div>
                  <label htmlFor="name block">Count In Stock</label> <br />
                  <input
                    type="text"
                    className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white "
                    value={countInStock}
onChange={(e) => setCountInStock(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="">Category</label> <br />
                  <select
                    value={category} // 🔥 Binds selected category
                    onChange={(e) => setCategory(e.target.value)}
                    className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white mr-[5rem]"
                  >
                    {!category && (
                      <option value="">-- Choose Category --</option> )}
                    {categories?.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-2">
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 py-3 px-8 rounded-lg text-lg font-bold bg-green-600 hover:bg-green-700 transition-colors"
                >
                  <FaArrowCircleUp />
                  Update
                </button>

                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 py-3 px-8 rounded-lg text-lg font-bold bg-pink-600 hover:bg-pink-700 transition-colors"
                >
                  <FaTrashAlt />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductUpdate
