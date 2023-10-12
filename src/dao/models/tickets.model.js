import { Schema, model } from "mongoose";
const TicketSchema = new mongoose.Schema({
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
    user: {
        type: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "user"
                }
            }
        ]
    },
    reference: String
  });
  export const ticketsModel = model('Tickets', TicketSchema)