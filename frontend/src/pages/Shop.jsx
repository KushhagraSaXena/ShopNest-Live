// src/pages/Shop.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import {
  fetchFavorites,
  addFavorite,
  removeFavorite,
} from "../redux/features/Favorites/favoriteSlice";
import { useFetchPublicCategoriesQuery } from "../redux/api/categoryApiSlice";
import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/Shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";

const Shop = () => {
  const dispatch   = useDispatch();

  // ──────────────────────────────────────────
  //   Redux state
  // ──────────────────────────────────────────
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );
  const { userInfo }   = useSelector((state) => state.auth);
  const favourites      = useSelector(
    (state) => state.favorites.favorites || []
  );

  // ──────────────────────────────────────────
  //   Data queries
  // ──────────────────────────────────────────
  const categoriesQuery = useFetchPublicCategoriesQuery();

  const filteredProductsQuery = useGetFilteredProductsQuery({ checked, radio });

  // ──────────────────────────────────────────
  //   Local UI state
  // ──────────────────────────────────────────
  const userId = userInfo?._id;
  const [priceFilter, setPriceFilter] = useState("");

  // ──────────────────────────────────────────
  //   Side‑effects
  // ──────────────────────────────────────────
  useEffect(() => {
    if (userId) dispatch(fetchFavorites(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (!checked.length || !radio.length) {
      if (!filteredProductsQuery.isLoading) {
        const filtered = filteredProductsQuery.data.filter(
          (p) =>
            p.price.toString().includes(priceFilter) ||
            p.price === parseInt(priceFilter, 10)
        );
        dispatch(setProducts(filtered));
      }
    }
  }, [
    checked,
    radio,
    filteredProductsQuery.data,
    dispatch,
    priceFilter,
  ]);

  // ──────────────────────────────────────────
  //   Handlers
  // ──────────────────────────────────────────
  const handleBrandClick = (brand) => {
    const byBrand = filteredProductsQuery.data?.filter(
      (p) => p.brand === brand
    );
    dispatch(setProducts(byBrand));
  };

  const handleCheck = (checkedNow, id) => {
    const updated = checkedNow
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updated));
  };

  const handlePriceChange = (e) => {
    setPriceFilter(e.target.value);
  };

  const handleAddFavorite = async ({ productId }) => {
    if (!userId) return;
    await dispatch(addFavorite({ userId, productId }));
    dispatch(fetchFavorites(userId));
  };

  const handleRemoveFavorite = async ({ productId }) => {
    if (!userId) return;
    await dispatch(removeFavorite({ userId, productId }));
    dispatch(fetchFavorites(userId));
  };

  // ──────────────────────────────────────────
  //   Derived values
  // ──────────────────────────────────────────
  const uniqueBrands = [
    ...new Set(
      filteredProductsQuery.data?.map((p) => p.brand).filter(Boolean)
    ),
  ];

  // ──────────────────────────────────────────
  //   JSX
  // ──────────────────────────────────────────
  return (
    <div className="container mx-auto bg-blue-50 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col md:flex-row">
        {/* ── Sidebar Filters ───────────────── */}
        <aside className="bg-blue-200 dark:bg-[#151515] p-5 w-full md:w-[18rem] rounded-md mb-6 md:mb-0">
          {/* Category filter */}
          <h2 className="text-center py-2 rounded-full mb-4 bg-blue-100 text-black dark:bg-pink-700 dark:text-white font-semibold">
            Filter by Categories
          </h2>
          {categories?.map((c) => {
            const id = `cat-${c._id}`;
            return (
              <label key={c._id} htmlFor={id} className="flex items-center mb-3">
                <input
                  id={id}
                  type="checkbox"
                  onChange={(e) => handleCheck(e.target.checked, c._id)}
                  className="w-4 h-4 text-blue-500 dark:text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-2 focus:ring-blue-600 dark:focus:ring-pink-600 dark:bg-gray-700 dark:border-gray-600 dark:accent-pink-500"
                />
                <span className="ml-2 text-sm text-black dark:text-gray-300">
                  {c.name}
                </span>
              </label>
            );
          })}

          {/* Brand filter */}
          <h2 className="text-center py-2 rounded-full my-4 bg-blue-100 text-black dark:bg-pink-700 dark:text-white font-semibold">
            Filter by Brands
          </h2>
          {uniqueBrands.map((brand) => {
            const id = `brand-${brand}`;
            return (
              <label key={brand} htmlFor={id} className="flex items-center mb-3">
                <input
                  id={id}
                  type="radio"
                  name="brand"
                  onChange={() => handleBrandClick(brand)}
                  className="w-4 h-4 text-blue-600 dark:text-pink-600 bg-gray-100 border-gray-300 focus:ring-2 focus:ring-blue-500 dark:focus:ring-pink-600 dark:bg-gray-700 dark:border-gray-600 dark:accent-pink-500"
                />
                <span className="ml-2 text-sm text-black dark:text-gray-300">
                  {brand}
                </span>
              </label>
            );
          })}

          {/* Price filter */}
          <h2 className="text-center py-2 rounded-full my-4 dark:border-none bg-blue-100 text-black dark:bg-pink-700 dark:text-white font-semibold">
            Filter by Price
          </h2>
          <input
            id="price-filter"
            type="text"
            value={priceFilter}
            onChange={handlePriceChange}
            placeholder="Enter price"
            className="w-full px-3 py-2 rounded-lg text-black border border-gray-300 focus:ring-2 focus:ring-blue-300 dark:text-white dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-pink-500"
          />

          {/* Reset */}
          <button
            onClick={() => window.location.reload()}
            className="w-full mt-5 bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-700 transition duration-150 dark:bg-pink-600 dark:hover:bg-pink-700"
          >
            Reset Filters
          </button>
        </aside>

        {/* ── Products Grid ─────────────────── */}
        <main className="flex-1 p-3">
          <h2 className="text-xl font-semibold text-center text-black dark:text-white mb-4">
            {products?.length} Products
          </h2>

          <div className="flex flex-wrap justify-center">
            {filteredProductsQuery.isLoading ? (
              <Loader />
            ) : products.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-300">
                No products found.
              </p>
            ) : (
              products.map((p) => (
                <div key={p._id} className="p-3">
                  <ProductCard
                    product={p}
                    userId={userId}
                    favourites={favourites}  
                    addFavorite={handleAddFavorite}
                    removeFavorite={handleRemoveFavorite}
                  />
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Shop;
