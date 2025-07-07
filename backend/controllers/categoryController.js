import Category from '../models/categoryModel.js';
import asyncHandler from '../middlewares/asyncHandler.js';

const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  try{
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Category name is required' });
    }
    // console.log('Creating category:', name); // Debugging line to check the name being passed
    // Check if the category already exists

    const existingCategory = await Category.findOne({ name: name.trim() });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }
    // console.log('Category does not exist, proceeding to create'); // Debugging line

    const category = await new Category({ name: name }).save();
    return res.json(category);
    // console.log('Category created successfully:', category);

  } catch (error) {
    console.error('Error creating category:', error);
    // Handle any unexpected errors
    return res.status(400).json({ message: error.message });    
  }
});

const updateCategory = asyncHandler (async (req, res) => {
  const { categoryId } = req.params;
  const { name } = req.body;

  try {
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Category name is required' });
    }

    // const category = await Category.findOne({_id:categoryId})
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found!' });
    }

    // Check if the new name is already taken by another category
    const existingCategory = await Category.findOne({ name: name.trim() });
    if (existingCategory && existingCategory._id.toString() !== categoryId) {
      return res.status(400).json({ message: 'Category name already exists' });
    }

    category.name = name.trim();
    const updatedCategory = await category.save();

    return res.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    return res.status(500).json({ message: error.message });
  }
});

const deleteCategory = asyncHandler(async (req, res) => {
  try {
    const removed = await Category.findByIdAndDelete(req.params.categoryId);
    if (!removed) {
      return res.status(404).json({ message: 'Category not found!' });
    }
    return res.json({ message: 'Category deleted successfully!', name: removed.name });
  } catch (error) {
    console.error('Error deleting category:', error);
    return res.status(500).json({ message: error.message });
  }
});

const listCategory = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find({});
    return res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(400).json({ message: error.message });
  }
});

const readCategory = asyncHandler(async (req, res) => {
  if (!req.params.categoryId) {
    return res.status(400).json({ message: 'Category ID is required' });
  }
  try {
    const category = await Category.findOne({ _id: req.params.categoryId });
    if (!category) {
      return res.status(404).json({ message: 'Category not found!' });
    }

    return res.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return res.status(400).json({ message: error.message });
  }
});

export { createCategory, updateCategory, deleteCategory, listCategory, readCategory };