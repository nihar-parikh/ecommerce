import express from "express";
import Cart from "../models/cart.js";
import { auth, verifyAdmin } from "../middleware/auth.js";
const router = express.Router();

//creating cart
router.post("/", auth, async (req, res) => {
  const cart = new Cart(req.body);

  try {
    const addCart = await cart.save();
    res.status(200).send(addCart);
  } catch (error) {
    res.status(500).send(error);
  }
});

//updating cart
router.put("/:id", auth, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).send(updatedCart);
  } catch (error) {
    res.status(400).send(error);
  }
});

//get user carts
router.get("/:userId", auth, async (req, res) => {
  try {
    const cart = await Cart.find({ userId: req.params.userId });

    res.status(201).send(cart);
  } catch (error) {
    res.status(500).send(error);
  }
});

//delete a product from a given cart
// router.delete("/deletecart/:cartId/:proId", auth, async (req, res) => {
//   // console.log(req.params.proId);
//   try {
//     const cart = await Cart.findById(req.params.cartId);
//     // console.log(cart);
//     if (!cart) {
//       return res.status(404).send(error);
//     }

//     const remainingProducts = cart.products.filter(
//       (product) => product.productId !== req.params.proId
//     );
//     // console.log("remainingProducts: ", remainingProducts);
//     cart.products = remainingProducts;
//     // console.log(cart);

//     // if (cart.products === []) {
//     //   cart = {};
//     // }
//     // console.log(cart);

//     res.status(200).send({
//       success: `product ${req.params.proId} has been deleted successfully from the cart`,
//       cart: cart,
//     });

//     //not working
//     if (cart.products === []) {
//       cart = {};
//     }

//     await cart.save();
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

//delete cart....id = cart id
router.delete("/deletecart/:cartId", auth, async (req, res) => {
  try {
    const cart = await Cart.findByIdAndDelete(req.params.cartId);
    if (!cart) {
      return res.status(404).send(error);
    }
    res.status(200).send({
      success: "cart has been deleted successfully",
      cart: cart,
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

//get all users carts
router.get("/", verifyAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).send(carts);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;

// const arr1 = [
//   { url: "/a", title: "A" },
//   { url: "/b", title: "B" },
//   { url: "/c", title: "C" },
//   { url: "/d", title: "D" },
//   { url: "/e", title: "E" },
// ];

// const arr2 = [
//   { url: "/f", title: "F" },
//   { url: "/g", title: "G" },
//   { url: "/c", title: "C" },
//   { url: "/d", title: "D" },
//   { url: "/h", title: "H" },
// ];

// // Using Find Method
// const res1 = arr2.filter((item2) =>
//   arr1.find((item1) => item2.url === item1.url)
// );
// console.log(res1);
