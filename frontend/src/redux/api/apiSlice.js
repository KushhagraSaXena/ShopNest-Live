import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";
import { toast } from "react-toastify";

// Base query with JWT included
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    // Read token from Redux state
    const token = getState().auth.userInfo?.token;

    // fallback to localStorage if needed
    // const token = getState().auth.userInfo?.token || localStorage.getItem("userToken");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Wrap baseQuery to handle errors globally
const baseQueryWithErrorHandler = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    const status = result.error.status;

    if (status === 401) {
      window.location.href = "/login"; // redirect if not authenticated
    } else if (status === 404 || status >= 500) {
      toast.error(
        result?.error?.data?.message || result?.error?.error || "Server error",
        { toastId: "serverError" }
      );
    }
  }

  return result;
};

// Create API slice
export const apiSlice = createApi({
  baseQuery: baseQueryWithErrorHandler,
  tagTypes: ["Product", "Order", "User", "Category"],
  endpoints: () => ({}),
});
