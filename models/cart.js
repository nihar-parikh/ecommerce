import mongoose from "mongoose";
//calling Schema instance from mongoose using destructing
const { Schema } = mongoose;

const cartSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    products: [
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
          type: String,
        },
        color: {
          type: String,
        },
        price: {
          type: Number,
          required: true,
        },
        productId: {
          type: String,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);
//user.createIndexes();

export default Cart;
