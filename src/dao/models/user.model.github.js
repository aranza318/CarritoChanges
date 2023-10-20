import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name:String,
    last_name:String,
    email:{type: String, unique:true},
    age:Number,
    password:{type:String},
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts',
        required: true,
      },
    role:String,
    phone: String,
    active: Boolean,
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
      },
    
});
const usersModel = mongoose.model("users", userSchema);
export default usersModel;