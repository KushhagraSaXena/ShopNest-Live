import mongoose from "mongoose";
const {ObjectId} = mongoose.Schema;

// Review schema for my e-commerce app
const reviewSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true
  },
  name: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
}, {timestamps: true});
 
// Product model for my e-commerce app

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
      type: String, 
      required: true,
    },
    publicId: {
      type: String, 
    },
  brand: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  category: {
    type: ObjectId,
    ref: "Category",
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  reviews: [reviewSchema],
  rating: {
    type: Number,
    required: true,
    default: 0,
  }, // average rating
  numReviews: {
    type: Number,
    required: true,
    default: 0,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  countInStock: {
    type: Number,
    required: true,
    default: 0,
  },
  sold: {
    type: Number,
    default: 0,
  },
}, {timestamps: true});

const Product = mongoose.model("Product", productSchema);

export default Product;
