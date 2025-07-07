import { apiSlice } from "./apiSlice";
import { CATEGORIES_URL } from "../constants";

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
        url: `${CATEGORIES_URL}/categories`,
      }),
    }),
    readCategory: builder.query({
      query: (categoryId) => ({
        url: `${CATEGORIES_URL}/${categoryId}`,
      }),
    }),
  })
  });

  export const {
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useListCategoriesQuery,
    useReadCategoryQuery,
  } = categoryApiSlice;
  // Export hooks for usage in functional components
  // The `useCreateCategoryMutation` hook can be used to create a new category