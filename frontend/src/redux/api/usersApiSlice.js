import {apiSlice} from './apiSlice'
import { USERS_URL } from '../constants'
import { logout } from '../features/auth/authSlice';
import Profile from '../../pages/User/Profile';
import { get } from 'mongoose';

export const userApiSlice = apiSlice.injectEndpoints({    //login endpoint
endpoints : (builder) => ({
    login: builder.mutation({
        query:(data) => ({
          url:`${USERS_URL}/auth`,
          method:"POST",
          body: data,
        }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: 'POST',
      }),
    }),

    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: "POST",
        body: data,
      }),
    }),

    Profile: builder.mutation({
      query: data => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
      }),
    }),

    getUsers: builder.query({
      query: () => ({
        url: USERS_URL,
        method: "GET",
      }),
      providesTags: ['User'],
      keepUnusedDataFor: 5,
    }),

    deleteUser: builder.mutation({
      query: userId => ({
        url: `${USERS_URL}/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ['User'],
    }),

    getUserDetails: builder.query({
      query: userId => ({
        url: `${USERS_URL}/${userId}`,
        method: "GET",
      }),
      keepUnusedDataFor: 5,
      invalidatesTags: ['User'],
    }),

    updateUser: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${USERS_URL}/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ['User'],
    }),


    addFavorite: builder.mutation({
      query: ({ userId, productId }) => ({
        url: `/users/${userId}/favourites/add`,
        method: "POST",
        body: { productId },
      }),
    }),
    removeFavorite: builder.mutation({
      query: ({ userId, productId }) => ({
        url: `/users/${userId}/favourites/remove`,
        method: "POST",
        body: { productId },
      }),
    }),
    getFavorites: builder.query({
      query: (userId) => `/users/${userId}/favourites`,
    }),

  }),
});

export const { useLoginMutation, useLogoutMutation, useRegisterMutation, useProfileMutation, useGetUsersQuery, useGetUserDetailsQuery, useUpdateUserMutation,useDeleteUserMutation } = userApiSlice;