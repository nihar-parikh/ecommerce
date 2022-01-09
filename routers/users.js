import express from "express";
import { body, validationResult } from "express-validator"; //see docs.
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/users.js";
import { auth, verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

const SECRET_KEY = process.env.PASSWORD_SECRET_KEY;
//console.log(SECRET_KEY);

//signup route
router.post(
  "/signup",
  [
    body("name").isLength({ min: 3 }),
    body("email", "enter valid email").isEmail(),
    body("password", "password must be atleast 5 characters").isLength({
      min: 5,
    }),
  ], //second parameters are for validation
  async (req, res) => {
    try {
      const errors = validationResult(req); //checking for error
      if (errors.isEmpty()) {
        const existedUser = await User.findOne({ email: req.body.email });
        if (existedUser) {
          return res.status(400).send("email already in use");
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const user = await User.create({
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword,
          image: req.body.image,
          phoneNumber: req.body.phoneNumber,
          address: req.body.address,
          gender: req.body.gender,
        });
        const token = jwt.sign({ _id: user._id }, SECRET_KEY);
        //return res.status(200).send(user);
        return res.status(200).send({ _id: user._id, token: token });
      } else {
        return res.status(400).send(errors);
      }
    } catch (error) {
      res.status(400).send(error);
    }
  }
);

//login route
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    //console.log(user);
    if (!user) {
      return res.status(404).send({ error: "invalid credentials" });
    }
    const matchedPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    //console.log(matchedPassword);
    if (!matchedPassword) {
      return res.status(404).send({ error: "invalid credentials" });
    }
    const token = jwt.sign({ _id: user._id }, SECRET_KEY);

    // const { password, ...otherInfo } = user; //it contains all other info
    const { password, ...otherInfo } = user._doc; //user._doc contains user info

    return res.status(200).send({ otherInfo, token: token });
  } catch (error) {
    res.status(500).send(error);
  }
});

//get user
router.get("/me", auth, async (req, res) => {
  try {
    //console.log("user: ", req.user._id);
    const user = await User.findById(req.user._id).select("-password"); //select method on User for selecting all fields, for excluding password use "-password"
    res.status(201).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

//get all users
router.get("/", verifyAdmin, async (req, res) => {
  try {
    const query = req.query.new;
    const users = query && (await User.find().sort({ _id: -1 })); //sorting users by latest created
    res.status(201).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

//get all users statistics
router.get("/stats", verifyAdmin, async (req, res) => {
  const date = new Date();
  //console.log(date);
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  //console.log(lastYear); //last year today

  //mongodb aggregate method....read docs for better understanding
  try {
    const data = await User.aggregate([
      {
        $match: { createdAt: { $gte: lastYear } },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

//update user
router.put("/:id", auth, async (req, res) => {
  try {
    const { name, email, password, image, address, phoneNumber, gender } =
      req.body;
    const updatedUser = {};
    //console.log(name, email, password);

    if (name) {
      updatedUser.name = name;
    }
    if (email) {
      updatedUser.email = email;
    }
    if (password) {
      updatedUser.password = password;
    }
    if (address) {
      updatedUser.address = address;
    }
    if (image) {
      updatedUser.image = image;
    }
    if (gender) {
      updatedUser.gender = gender;
    }
    if (phoneNumber) {
      updatedUser.phoneNumber = phoneNumber;
    }
    const user = await User.findByIdAndUpdate(req.params.id, updatedUser, {
      new: true,
    });
    if (!user) {
      return res.status(404).send(error);
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(user.password, salt);
    //console.log(hashedPassword);
    user.password = hashedPassword;
    await user.save();
    res.status(200).send({ _id: user._id, user });
  } catch (error) {
    res.status(400).send(error);
  }
});

//delete user
router.delete("/deleteuser/:id", auth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send(error);
    }
    res
      .status(200)
      .send({ success: "user has been deleted successfully", user: user });
  } catch (error) {
    res.status(400).send(error);
  }
});

export default router;
