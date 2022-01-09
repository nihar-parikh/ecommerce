import express from "express";
import connectToMongo from "../db/mongoose.js";
import userRouters from "../routers/users.js";
import productRouters from "../routers/products.js";
import cartRouters from "../routers/cart.js";
import orderRouters from "../routers/order.js";
import stripeRouters from "../routers/stripe.js";
import cors from "cors";

connectToMongo();
const port = process.env.port || 8000;

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/users", userRouters); //passing userRouters in app
app.use("/api/products", productRouters); //passing productRouters in app
app.use("/api/carts", cartRouters); //passing cartRouters in app
app.use("/api/orders", orderRouters); //passing orderRouters in app
app.use("/api/checkout", stripeRouters); //passing stripeRouters in app

app.listen(port, () => {
  console.log(`backend server is running on localhost port: ${port}`);
});
