import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Category name is required"],
    maxLength: [50, "Category name cannot exceed 50 characters"],
    unique: true,
  }
});

const Category = mongoose.model("Category", categorySchema);
export default Category;