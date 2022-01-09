import express from "express";
import Product from "../models/products.js";
import { auth, verifyAdmin } from "../middleware/auth.js";
const router = express.Router();

//creating products
router.post("/", verifyAdmin, async (req, res) => {
  const products = new Product(req.body);

  try {
    const addProducts = await products.save();
    res.status(200).send(addProducts);
  } catch (error) {
    res.status(500).send(error);
  }
});

//get an user product ... no authentication bcoz any user can see products
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(201).send(product);
  } catch (error) {
    res.status(500).send(error);
  }
});

//updating products
router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const { title, description, image, categories, size, colour, price } =
      req.body;
    const updatedProduct = {};
    //console.log(name, email, password);

    if (title) {
      updatedProduct.title = title;
    }
    if (description) {
      updatedProduct.description = description;
    }
    if (image) {
      updatedProduct.image = image;
    }
    if (categories) {
      updatedProduct.categories = categories;
    }
    if (size) {
      updatedProduct.size = size;
    }
    if (colour) {
      updatedProduct.colour = colour;
    }
    if (price) {
      updatedProduct.price = price;
    }
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updatedProduct,
      {
        new: true,
      }
    );
    if (!product) {
      return res.status(404).send(error);
    }

    await product.save();
    res.status(200).send({ product, _id: product._id });
  } catch (error) {
    res.status(400).send(error);
  }
});

//get all products
router.get("/", async (req, res) => {
  const queryNew = req.query.new;
  const queryCategories = req.query.categories;
  try {
    let products = [];
    if (queryNew) {
      products = await Product.find().sort({ createdAt: -1 }); //sorting users by latest created
    } else if (queryCategories) {
      products = await Product.find({
        categories: {
          $in: [queryCategories],
        },
      });
    } else {
      products = await Product.find();
    }
    res.status(201).send(products);
  } catch (error) {
    res.status(500).send(error);
  }
});

//delete products
router.delete("/deleteproduct/:id", verifyAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).send(error);
    }
    res.status(200).send({
      success: "product has been deleted successfully",
      product: product,
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

export default router;
