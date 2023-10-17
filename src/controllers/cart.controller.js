import CartServices from "../services/cart.service.js";
import { createTicket } from "./ticket.controller.js";
import { v4 as uv4 } from "uuid";
import ProductManager from "../dao/ProductManager.js";
import { cartModel } from "../dao/models/cart.model.js";

class CartsControl {
    constructor(){
        this.cartServices = new CartServices();
    }
    async createNewCart(req, res){
        try {
            const newCart = await this.cartServices.creatNewCart();
            res.send(newCart);
        } catch (error) {
            res.status(500).send({status:"error", message:error.message});
        }
    }
    async getThisCart(req, res){
        try {
            const carrito = await this.cartServices.getByID(req.params.cid);
            res.send({products:carrito.products});
        } catch (error) {
            res.status(400).send({status:"error", message: error.message});
        }
    }
    async addProduct(req,res){
        try {
            const{cid,pid}= req.params;
            const resultado = await this.cartServices.addNewProduct(cid, pid);
            res.send(resultado);
        } catch (error) {
            res.status(400).send({status:"error", message: error.message});
        }
    }
    async updateQuantity(req,res){
        try {
            const{cid,pid}= req.params;
            const {quantity} = req.body.quantity;
            const result = await this.cartServices.updateQuantityProductFromCart(cid, pid, quantity);
            res.send(result);
        } catch (error) {
            res.status(400).send({status:"error", message: error.message});
        }
    }
    async updateCart(req, res) {
        try {
          const cid = req.params.cid;
          const products = req.body.products;
          await this.cartServices.updateCart(cid, products);
          res.send({status: "ok", message: "El producto se agregó correctamente!"});
        } catch (error) {
          res.status(400).send({ status: "error", message: error.message });
        }
      }
    async deleteThisProduct(req,res){
        try {
            const{cid,pid}= req.params;
            const result = await this.cartServices.deleteProduct(cid, pid);
            res.send(result);
        } catch (error) {
            res.status(400).send({status:"error", message: error.message});
        }
    }
    async cleanCart(req,res){
        try {
            const cid = req.params.cid;
            const result = await this.cartServices.cleanCart(cid);
            res.send(result);          
        } catch (error) {
            res.status(400).send({status:"error", message: error.message});
        }
    }
    async purchaseTicket (req, res){
        console.log("Ruta /carts/:cid/purchase accedida");

        try {
          if (!req.user || !req.user.id) {
            console.error("req.user no está definido");
            return res.status(400).json({ error: "Usuario no definido" });
          }
    
          const cart = await this.cartServices.getByID(req.params.cid);
    
          if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
          }
    
          console.log("Productos en el carrito:", cart.products);
    
          const productManager = new ProductManager();
          const failedProducts = [];
          const successfulProducts = [];
    
          for (const item of cart.products) {
            const product = await productManager.getProductById(item.product);
    
            if (!product) {
              console.error(`Producto ${item.product} no encontrado`);
              failedProducts.push(item);
              continue;
            }
    
            if (product.stock < item.quantity) {
              console.error(
                `Stock insuficiente para el producto ${JSON.stringify(
                  item.product
                )}`
              );
              failedProducts.push(item);
            } else {
              successfulProducts.push(item);
              const newStock = product.stock - item.quantity;
              await productManager.updateProduct(item.product, { stock: newStock });
            }
          }
    
          await cartModel.updateOne(
            { _id: req.params.cid },
            { products: failedProducts }
          );
    
          if (successfulProducts.length === 0) {
            return res.status(400).json({
              error: "No se pudo comprar ningun producto",
              failedProducts,
            });
          }
    
          const totalAmount = successfulProducts.reduce((total, product) => {
            return total + product.product.price * product.quantity;
          }, 0);
    
          console.log("Total Amount calculado:", totalAmount);
    
          const ticketData = {
            code: uuidv4(),
            purchase_datetime: new Date(),
            amount: totalAmount,
            purchaser: req.user.email,
          };
    
          console.log("Ticket Data justo antes de crear el ticket:", ticketData);
          const ticketCreated = await createTicket({
            body: ticketData,
          });
          console.log("Ticket Creado:", ticketCreated);
    
          res.json({
            status: "success",
            message: "Compra realizada con éxito",
            ticket: ticketCreated,
            failedProducts: failedProducts.length > 0 ? failedProducts : undefined,
          });
        } catch (error) {
          console.error("Error específico al crear el ticket de compra:", error);
          res.status(500).json({ error: "Error al crear el ticket de compra" });
        }
    }
    async getPurchase(req, res){
        try {
            const cid = req.params.cid;
            const compra = await this.cartServices.getByID(cid);
            if(compra){
            res.json({status:"success", data: compra})
            } else {
                res.status(404).json({status: "error", message: "Compra no encontrada"})
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({status: "error", message: "Error interno"})
        }
    }
}

export default new CartsControl();