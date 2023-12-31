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
   
  },
  role: String,
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
});

userSchema.pre('find', function (next) {
  this.populate("cart.cartId");
  next();
});
const userModel = mongoose.model("users", userSchema);
export default userModel;

