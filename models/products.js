import mongoose from "mongoose";
//calling Schema instance from mongoose using destructing
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    categories: {
      type: Array,
    },
    size: {
      type: Array,
    },
    color: {
      type: Array,
    },
    price: {
      type: Number,
      required: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
//user.createIndexes();

export default Product;
