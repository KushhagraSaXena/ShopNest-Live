import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import fs from 'fs';
import path from 'path';
import mongoose from "mongoose"; // ✅ Required to use ObjectId

const addProduct = asyncHandler(async (req, res) => {
  // res.send("Product added successfully!");

  const { name, category, description, price, quantity, image, brand, countInStock } = req.fields;
  try {
    
    // console.log("Received product data:", {
    //   name,
    //   description,
    //   price,
    //   category,
    //   quantity,
    //   image,
    //   brand
    // });

    if (category) {
  req.fields.category = new mongoose.Types.ObjectId(category.trim());
    // req.fields.category = new mongoose.Types.ObjectId.createFromHexString(category.trim())

}
    //validate required fields
    switch (true) {
      case !name:
        return res.status(400).json({ message: "Name is required" });
      case !description:
        return res.status(400).json({ message: "Description is required" });
      case !price:
        return res.status(400).json({ message: "Price is required" });
      case !category:
        return res.status(400).json({ message: "Category is required" });
      case !quantity:
        return res.status(400).json({ message: "Quantity is required" });
      case !image:
        return res.status(400).json({ message: "Image is required" });
      case !brand:
        return res.status(400).json({ message: "Brand is required" });
      case countInStock === undefined:
        return res.status(400).json({ message: "Count in stock is required" });
     
      case typeof name !== "string":
        return res.status(400).json({ message: "Name must be a Letters" });
        case isNaN(price):
        return res.status(400).json({ message: "Price must be a number" });
      case isNaN(quantity):
        return res.status(400).json({ message: "Quantity must be a number" });
      case isNaN(countInStock):
        return res.status(400).json({ message: "Count in stock must be a number" });
      case price <= 0:
        return res.status(400).json({ message: "Price must be greater than 0" });
      case quantity < 0:
        return res.status(400).json({ message: "Quantity cannot be negative" });
      case countInStock < 0:
        return res.status(400).json({ message: "Count in stock cannot be negative" });
      case name.length < 4:
        return res.status(400).json({ message: "Name must be at least 4 characters long" });
      case description.length < 5:
        return res.status(400).json({ message: "Description must be at least 5 characters long" });
      case brand.length < 3:
        return res.status(400).json({ message: "Brand must be at least 3 characters long" });
    }

    // Check if the product already exists
    const existingProduct = await Product.findOne({ name: name.trim() });
    if (existingProduct) {
      return res.status(400).json({ message: "Product already exists" });
    }

    // Create a new product
    const product = new Product({
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
category: new mongoose.Types.ObjectId(category.trim()),
      quantity: parseInt(quantity, 10),
      image: image.trim(),
      brand: brand.trim(),
      countInStock: parseInt(countInStock, 10),
    });
    await product.save();
    res.status(201).json(product);
  } 
  catch (error) {
    console.error("Error adding product:", error);
    res.status(400).json({ message: error.message });
    }
});

const updateProductDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, category, description, price, quantity, image, brand, countInStock } = req.fields;
  try {
    // Validate required fields

    switch (true) {
      case !name:
        return res.status(400).json({ message: "Name is required" });
      case !description:
        return res.status(400).json({ message: "Description is required" });
      case !price:
        return res.status(400).json({ message: "Price is required" });
      case !category:
        return res.status(400).json({ message: "Category is required" });
      case !quantity:
        return res.status(400).json({ message: "Quantity is required" });
      case !image:
        return res.status(400).json({ message: "Image is required" });
      case !brand:
        return res.status(400).json({ message: "Brand is required" });
      case countInStock === undefined:
        return res.status(400).json({ message: "Count in stock is required" });
      case typeof name !== "string":
        return res.status(400).json({ message: "Name must be a Letters" });
      case isNaN(price):
        return res.status(400).json({ message: "Price must be a number" });
      case isNaN(quantity):
        return res.status(400).json({ message: "Quantity must be a number" });
      case isNaN(countInStock):
        return res.status(400).json({ message: "Count in stock must be a number" });
      case price <= 0:
        return res.status(400).json({ message: "Price must be greater than 0" });
      case quantity < 0:
        return res.status(400).json({ message: "Quantity cannot be negative" });
      case countInStock < 0:
        return res.status(400).json({ message: "Count in stock cannot be negative" });
      case name.length < 4:
        return res.status(400).json({ message: "Name must be at least 4 characters long" });
      case description.length < 5:
        return res.status(400).json({ message: "Description must be at least 5 characters long" });
      case brand.length < 3:
        return res.status(400).json({ message: "Brand must be at least 3 characters long" });
    }

    // Find the product by ID
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (category) {
  product.category = new mongoose.Types.ObjectId(category.trim());
}

    // Update product details
    product.name = name.trim();
    product.description = description.trim();
    product.price = parseFloat(price);
    product.category = category.trim();
    product.quantity = parseInt(quantity, 10);
    product.image = image.trim();
    product.brand = brand.trim();
    product.countInStock = parseInt(countInStock, 10);
    await product.save();
    res.status(200).json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(400).json({ message: error.message });
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    // Find the product by ID
    const product = await Product.findById(id);
    // const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Removing image file if exists
    if (product.image) {
      const imagePath = path.join(
        path.resolve(), // instead of __dirname in ES modules
        'uploads',
        path.basename(product.image)
      );
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await product.deleteOne(); // or Product.deleteOne({ _id: id })

    return res.status(200).json({
      message: "Product deleted successfully",
      name: product.name, 
      deletedProduct: product, 
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(400).json({ message: error.message });
  }
});

const getProducts = asyncHandler(async (req, res) => {
  try {
    const pageSize = 6; // Number of products per page
    // const page = Number(req.query.page) || 1; // Current page number
    // const products = await Product.find({})
    const keywords = req.query.keywords ? { name: { $regex: req.query.keywords, $options: "i" } } : {};
    const category = req.query.category ? { name: { $regex: req.query.category, $options: "i" } } : {};

    const count = await Product.countDocuments({ ...keywords, ...category }); // Count total products matching the criteria
    const page = Number(req.query.page) || 1; // Current page number
    const products = await Product.find({ ...keywords, ...category }).sort({ createdAt: -1 }).skip((page - 1) * pageSize) //this is for pagination
      .limit(pageSize); // Fetch products with pagination
     //sort Fetch all products sorted by creation date

    res.status(200).json({
       products, 
       page, 
       pages: Math.ceil(count / pageSize), 
       hasMore: products.length === pageSize 
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(400).json({ message: error.message });
  }
});

const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    // Find the product by ID
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(400).json({ message: error.message });
  }
});

const getAllProducts = asyncHandler(async (req, res) => {
  try {
    // Fetch all products
    const products = await Product.find({}).populate('category').limit(12).sort({ createdAt: -1 }); // Sort by creation date
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching all products:", error);
    res.status(400).json({ message: error.message });
  }
});

// Add this controller if you want to get reviews for a product
const getProductReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product.reviews || []);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const searchProducts = async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;
    const filter = {};

    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }
    if (category) {
      filter.category = category;
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error searching products', error: error.message });
  }
};

const addProductReview = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400);
        throw new Error("Product already reviewed");
      }

      // Use username or name from req.user
      const reviewerName = req.user.username || req.user.name || "Anonymous";

      const review = {
        name: reviewerName,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);

      product.numReviews = product.reviews.length;

      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: "Review added" });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const getTopProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(4);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const getNewProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find().sort({ _id: -1 }).limit(5);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const filterProducts = asyncHandler(async (req, res) => {
  try {
    const { checked = [], radio = [] } = req.body;

    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

    const products = await Product.find(args);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

export { 
  addProduct, 
  updateProductDetails, 
  deleteProduct, 
  getProducts, 
  getProductById, 
  getAllProducts, 
  addProductReview, 
  getProductReview, 
  searchProducts,
  getTopProducts,      
  getNewProducts,      
  filterProducts       
};
