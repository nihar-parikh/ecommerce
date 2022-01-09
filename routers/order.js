import express from "express";
import Order from "../models/order.js";
import { auth, verifyAdmin } from "../middleware/auth.js";
const router = express.Router();

//creating order
router.post("/", auth, async (req, res) => {
  const order = new Order(req.body);

  try {
    const addOrder = await order.save();
    res.status(200).send(addOrder);
  } catch (error) {
    res.status(500).send(error);
  }
});

//updating order
router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).send(updatedOrder);
  } catch (error) {
    res.status(400).send(error);
  }
});

//get user order
router.get("/:userId", auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.status(201).send(orders);
  } catch (error) {
    res.status(500).send(error);
  }
});

//delete order
router.delete("/deleteorder/:id", verifyAdmin, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).send(error);
    }
    res.status(200).send({
      success: "order has been deleted successfully",
      order: order,
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

//get all users orders
router.get("/", verifyAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).send(orders);
  } catch (error) {
    res.status(500).send(error);
  }
});

//get monthly income .......not working....
//adminId
router.get("/income/:id", verifyAdmin, async (req, res) => {
  const date = new Date();
  // console.log(date);
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  // console.log(lastMonth, previousMonth);
  try {
    const income = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: previousMonth,
          },
        },
      },
      {
        $project: {
          month: {
            $month: "$createdAt",
          },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).send(income);
  } catch (error) {
    res.status(500).send(error);
  }
});

//get monthly income of selected product ....not working->not showing the product amount
//adminId
router.get("/income/:id", verifyAdmin, async (req, res) => {
  const productId = req.query.pid;
  // console.log("productId: ", productId);
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  // console.log(date);

  try {
    const income = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: previousMonth },
          ...(productId && {
            products: { $elemMatch: { productId } },
          }),
        },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
