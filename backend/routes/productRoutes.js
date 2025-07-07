import express from 'express';
import formidable from 'express-formidable';
import checkId from '../middlewares/checkId.js';
import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware.js';

//controllers
import { addProduct, 
  updateProductDetails, 
  deleteProduct, 
  getProductById,  
  getProducts, 
  getAllProducts, 
  addProductReview, 
  getProductReview,
  searchProducts,
  getTopProducts,
  getNewProducts,
  filterProducts
} from '../controllers/productController.js';

const router = express.Router();
// Define routes for product operations
router.route('/')
  .post(authenticate, authorizeAdmin, formidable(), addProduct)
  .get(getProducts);

router.route('/search')
  .get(searchProducts); // This route can be used for searching products with query parameters

router.route('/allproducts')
  .get(getAllProducts); // This route can be used to get all products, possibly with pagination or filtering

//review routes
router.route('/:id/reviews')
  .post(authenticate, addProductReview, checkId) // This is for adding reviews
  .get(checkId, getProductReview); // this is for getting reviews of a specific product

router.get("/top", getTopProducts);
router.get("/new", getNewProducts);

router.route('/:id')
  .put(authenticate, authorizeAdmin, formidable(), updateProductDetails)
  .get(checkId, getProductById)
  .delete(authenticate, authorizeAdmin, deleteProduct);

router.route("/filtered-products").post(filterProducts);

  
export default router;
