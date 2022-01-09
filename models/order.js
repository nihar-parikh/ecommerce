import mongoose from "mongoose";
//calling Schema instance from mongoose using destructing
const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    products: [
      {
        productId: {
          type: String,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    amount: {
      type: Number,
      required: true,
    },
    address: {
      type: Object,
      required: true,
    }, //type:object bcoz address contains multiple lines
    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
//user.createIndexes();

export default Order;
