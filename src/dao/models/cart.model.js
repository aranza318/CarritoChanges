import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    id: Number,
    products: {
      type: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products"
          },
          quantity: { type: Number, default: 0 }
        },
      ],
    },
  });

cartSchema.pre('find', function () {
    this.populate({ path: 'products', populate: { path: '_id', model: 'products' } });
  });
  
cartSchema.pre('findOne', function () {
    this.populate({ path: 'products', populate: { path: '_id', model: 'products' } });
  });

export const cartModel = mongoose.model("carts", cartSchema);
