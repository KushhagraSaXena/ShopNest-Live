import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";
import { toast } from "react-toastify";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.userInfo?.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithErrorHandler = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    const status = result.error.status;

    if (status === 401) {
      window.location.href = '/login';   // ✅ KEEP
    } else if (status === 404 || status >= 500) {
      toast.error(result?.error?.data?.message || result?.error?.error || "Server error", {
        toastId: "serverError",
      });
    }
  }
  return result;
};


export const apiSlice = createApi({
  baseQuery: baseQueryWithErrorHandler,
  tagTypes: ['Product', 'Order', 'User', 'Category'],
  endpoints: () => ({}),
})

