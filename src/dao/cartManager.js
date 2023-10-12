import { cartModel } from "./models/cart.model.js";
import mongoose from "mongoose";
import { ticketModel } from "./models/ticket.model.js";

class CartManager {
  //Crea el nuevo carrito
  async newCart() {
    let cart = await cartModel.create({ products: [] });
    console.log("Cart created!");
    return {
      status: "ok",
      message: "El Carrito se creó correctamente!",
      id: cart._id,
    };
  }
  //Obtiene el carrito por ID
  async getCart(id) {
   
      return (await cartModel.findOne({ _id: id }).lean()) || null;
  
  }
  //Consigue todos los carritos
  async getCarts() {
    return await cartModel.find().lean();
  }
  //Agrega un cporducto al carrito por su ID
  async addProductToCart(cid, pid) {
    try {
      console.log(`Adding product ${pid} to cart ${cid}`);
  
      if (mongoose.Types.ObjectId.isValid(cid) && mongoose.Types.ObjectId.isValid(pid)) {
          const updateResult = await cartModel.updateOne(
          { _id: cid, "products.product": pid },
          { $inc: { "products.$.quantity": 1 } }
        );
        
        console.log("Update result:", updateResult);
          if (updateResult.matchedCount === 0) {
          const pushResult = await cartModel.updateOne(
            { _id: cid },
            { $push: { products: { product: pid, quantity: 1 } } }
          );
          
          console.log("Push result:", pushResult);
        }
  
        return {
          status: "ok",
          message: "El producto se agregó correctamente!",
        };
      } else {
        return {
          status: "error",
          message: "ID inválido!",
        };
      }
    } catch (error) {
      console.error(error);
      return {
        status: "error",
        message: "Ocurrió un error al agregar el producto al carrito!",
      };
    }
  }
  
  //Incrementa cantidad, pero esta funcion ya esta incluida en la de arriba asi que no es necesaria
  async updateQuantityProductFromCart(cid, pid, quantity) {
    try {
      if (this.validateId(cid)) {
        const cart = await this.getCart(cid);
        const product = cart.products.find((item) => item.product === pid);
        product.quantity = quantity;

        await cartModel.updateOne({ _id: cid }, { products: cart.products });
        console.log("Product updated!");

        return true;
      } else {
        console.log("Not found!");

        return false;
      }
    } catch (error) {
      return false;
    }
  }
  //Borra un producto del carrito
  async deleteProductFromCart(cid, pid) {
    try {
      if (this.validateId(cid)) {
        const cart = await this.getCart(cid);
        const products = cart.products.filter((item) => item.product !== pid);

        await cartModel.updateOne({ _id: cid }, { products: products });
        console.log("Product deleted!");

        return true;
      } else {
        console.log("Not found!");

        return false;
      }
    } catch (error) {
      return false;
    }
  }
  
  //Vacia el carrito
  async deleteProductsFromCart(cid) {
    try {
      if (this.validateId(cid)) {
        const cart = await this.getCart(cid);

        await cartModel.updateOne({ _id: cid }, { products: [] });
        console.log("Products deleted!");

        return true;
      } else {
        console.log("Not found!");

        return false;
      }
    } catch (error) {
      return false;
    }
  }

  //Compra
  async purchase(req, res){
    try {
      const {cid} = req.params
      const cart = await this.getCart(cid);
      if(!cart){
      
      }
    } catch (error) {
      
    }
  }



  validateId(id) {
    return id.lenght === 24 ? true : false;
  }
}

export default CartManager;
