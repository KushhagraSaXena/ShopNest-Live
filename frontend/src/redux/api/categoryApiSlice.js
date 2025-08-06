import { apiSlice } from "./apiSlice";
import { CATEGORIES_URL } from "../constants";
import { PUBLIC_CATEGORIES_URL } from "../constants";

export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCategory: builder.mutation({
      query: (categoryData) => ({
        url: `${CATEGORIES_URL}`,
        method: "POST",
        body: categoryData,
      }),
    }),
    updateCategory: builder.mutation({
      query: ({ categoryId, updatedCategory }) => ({
        url: `${CATEGORIES_URL}/${categoryId}`,
        method: "PUT",
        body: updatedCategory,
      }),
    }),
    deleteCategory: builder.mutation({
      query: (categoryId) => ({
        url: `${CATEGORIES_URL}/${categoryId}`,
        method: "DELETE",
      }),
    }),
    listCategories: builder.query({
      query: () => ({
        url: `${CATEGORIES_URL}`,
      }),
    }),
    fetchCategories: builder.query({
      query: () => ({
        url: `${CATEGORIES_URL}`,
      }),
      providesTags: ["Categories"],
    }),

    readCategory: builder.query({
      query: (categoryId) => ({
        url: `${CATEGORIES_URL}/${categoryId}`,
      }),
    }),

        // ✅ Public categories (no token required)
    fetchPublicCategories: builder.query({
      query: () => ({
        url: `${PUBLIC_CATEGORIES_URL}`,
      }),
     }),
    }),
  });

  export const {
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useListCategoriesQuery,
    useFetchCategoriesQuery,
    useReadCategoryQuery,
      useFetchPublicCategoriesQuery,
  } = categoryApiSlice;
  // Export hooks for usage in functional components
  // The `useCreateCategoryMutation` hook can be used to create a new category