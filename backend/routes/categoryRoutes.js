import express from 'express';
const router = express.Router();
// import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import { createCategory, updateCategory, deleteCategory, listCategory, readCategory } from '../controllers/categoryController.js';
import {authenticate, authorizeAdmin} from "../middlewares/authMiddleware.js";
router.route('/')
  // .get(getCategories)
  .post(authenticate, authorizeAdmin, createCategory);

  router.route('/categories')
    .get(authenticate, authorizeAdmin, listCategory);

router.route('/:categoryId')
  .get(authenticate, authorizeAdmin, readCategory)
  .put(authenticate, authorizeAdmin, updateCategory)
  .delete(authenticate, authorizeAdmin, deleteCategory)

  router.route('/:categoryId')
  .get(authenticate, authorizeAdmin, readCategory)
  .put(authenticate, authorizeAdmin, updateCategory)
  .delete(authenticate, authorizeAdmin, deleteCategory);




export default router;