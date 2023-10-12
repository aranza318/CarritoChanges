import CartServices from "../services/cart.service.js";
import { createTicket } from "./ticket.controller.js";
import { v4 as uv4 } from "uuid";

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
            const quantity = req.body.quantity;
            const result = await this.cartServices.updateQuantityProductFromCart(cid, pid, quantity);
            res.send(result);
        } catch (error) {
            res.status(400).send({status:"error", message: error.message});
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
            console.log("User: ", req.user);
            if(!req.user || !req.user.id){
                console.error("req no esta definido");
                return res.status(400).json({error:"Usuario no definido"})
            }
            const cart = await this.cartServices.getThisCart(req.params.cid);
            if(!cart){
                return res.status(404).json({error:"Carrito no encontrado"})
            }
            console.log("Productos en el carrito: ", cart.products);
            const totalAmount = cart.products.reduce((total, product)=> {
                console.log("Producto: ", product.product, 
                            "Precio: ", product.product.price, 
                            "Cantidad: ", product.quantity); 
                        return total + product.product.price * product.quantity;
            }, 0);
           console.log("Total: ", totalAmount);
           const ticketInfo = {
            code: uv4(),
            purchase_date: new Date(),
            amount : totalAmount,
            purchaser: req.user.email
           }
           console.log("Data para ticket: ", ticketInfo);
           const ticketOk = await createTicket({body: ticketInfo}, res);
           console.log("Ticket creado: ", ticketOk);
        } catch (error) {
            console.error("Error: ", error)
            res.status(500).json({error:"Error al crear el ticket de compra"})
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