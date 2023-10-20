import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    id: Number,
    code: {
        type: String,
        required: true,
        unique:true
    },
    purchase_datetime:{
        type: Date,
        default: Date.now,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser:{
        type: String,
        ref: "users",
        required: true
    },
    products: [
        {
          idProduct: { type: Object },
          _id: false,
          quantity: { type: Number },
          totalPrice: { type: Number },
        },
      ],
});

ticketSchema.pre('find', function () {
    this.populate({ path: 'products', populate: { path: '_id', model: 'products' } });
});
  
  ticketSchema.pre('findOne', function () {
    this.populate({ path: 'products', populate: { path: '_id', model: 'products' } });
});


export const ticketModel = mongoose.model("tickets", ticketSchema)

