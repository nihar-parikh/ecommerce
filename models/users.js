import mongoose from "mongoose";
//calling Schema instance from mongoose using destructing
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: Number,
      trim: true,
    },
    address: {
      type: Object,
    },
    gender: {
      type: String,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
//user.createIndexes();

export default User;
