import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch user's favourites
export const fetchFavorites = createAsyncThunk(
  "favorites/fetchFavorites",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/users/${userId}/favourites`);
      // Always return array of string IDs
      return data.map((fav) => fav.toString());
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// Add a favourite
export const addFavorite = createAsyncThunk(
  "favorites/addFavorite",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `/api/users/favourites/add`,
        { productId },
        { withCredentials: true }
      );
      // Always return array of string IDs
      return data.favourites.map((fav) => fav.toString());
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// Remove a favourite
export const removeFavorite = createAsyncThunk(
  "favorites/removeFavorite",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `/api/users/favourites/remove`,
        { productId },
        { withCredentials: true }
      );
      // Always return array of string IDs
      return data.favourites.map((fav) => fav.toString());
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

const favoriteSlice = createSlice({
  name: "favorites",
  initialState: {
    favorites: [],
    loading: false,
    error: null,
  },
  reducers: {
    setFavorites: (state, action) => {
      state.favorites = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.favorites = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // add
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.favorites = action.payload;
      })
      // remove
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.favorites = action.payload;
      });
  },
});

export const { setFavorites } = favoriteSlice.actions;
export default favoriteSlice.reducer;