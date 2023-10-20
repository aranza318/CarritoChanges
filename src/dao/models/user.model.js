import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String,
    unique: true,
  },
  age: Number,
  password: String,
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'carts',
    required: true,
  },
  role: String,
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
});
const userModel = mongoose.model("users", userSchema);
export default userModel;

