// export const BASE_URL = "";
export const BASE_URL = import.meta.env.VITE_API_URL;

// Users
export const USERS_URL = `${BASE_URL}/api/users`;
// export const USERS_URL = "/api/users";


// Categories
export const CATEGORIES_URL = `${BASE_URL}/api/category`;
export const PUBLIC_CATEGORIES_URL = `${BASE_URL}/api/category/public`;
// export const CATEGORIES_URL = "/api/category";
// export const PUBLIC_CATEGORIES_URL = "/api/category/public";

// Products
export const PRODUCT_URL = `${BASE_URL}/api/products`;
export const UPLOAD_URL = `${BASE_URL}/api/uploads`;
// export const PRODUCT_URL = "/api/products";
// export const UPLOAD_URL = "/api/upload";

// Cart
export const CART_URL = `${BASE_URL}/api/cart`;
// export const CART_URL = "/api/cart";

// Orders & Payments
export const ORDERS_URL = `${BASE_URL}/api/orders`;
export const PAYPAL_URL = `${BASE_URL}/api/config/paypal`;
// export const ORDERS_URL = "/api/orders";
// export const PAYPAL_URL = "/api/config/paypal";
