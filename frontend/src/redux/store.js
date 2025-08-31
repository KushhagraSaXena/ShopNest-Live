import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { apiSlice } from "./api/apiSlice";
import authReducer from './features/auth/authSlice'
import favoritesReducer from "./features/Favorites/favoriteSlice";
import cartSliceReducer from "./features/cart/cartSlice";
import shopReducer from "./features/Shop/shopSlice";
import { getFavoritesFromLocalStorage } from "../../Utils/localStorage";

const initialFavourites = getFavoritesFromLocalStorage(); //can be removed as shhifted to mongo db

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    favorites: favoritesReducer,
    cart: cartSliceReducer,
    shop: shopReducer,
  },
  // Remove preloadedState for favorites, let slice handle it
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

setupListeners(store.dispatch);
export default store;