import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name:{type: String},
    last_name:{type: String},
    email:{type: String, unique:true},
    age:Number,
    password:String,
    cart: {type: mongoose.Schema.Types.ObjectId, ref:"carts"},
    rol: {
        type: String,
        required: true,
        default: 'user'
      },
});
const usersModel = mongoose.model("users", userSchema);
export default usersModel;