// export const BASE_URL = "";
export const BASE_URL = import.meta.env.VITE_API_URL;
export const USERS_URL = "/api/users";
export const CATEGORIES_URL = "/api/category";
export const PUBLIC_CATEGORIES_URL = "/api/category/public";

export const PRODUCT_URL = `${BASE_URL}/api/products`;
export const UPLOAD_URL = `${BASE_URL}/api/uploads`;
// export const PRODUCT_URL = "/api/products";
// export const UPLOAD_URL = "/api/upload";
export const CART_URL = "/api/cart";

export const ORDERS_URL = "/api/orders";
export const PAYPAL_URL = "/api/config/paypal";
