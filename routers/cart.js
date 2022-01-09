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

//get user cart
router.get("/:userId", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.status(201).send(cart);
  } catch (error) {
    res.status(500).send(error);
  }
});

//delete cart
router.delete("/deletecart/:id", auth, async (req, res) => {
  try {
    const cart = await Cart.findByIdAndDelete(req.params.id);
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
