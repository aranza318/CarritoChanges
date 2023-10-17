import { Router } from "express";
import CartManager from "../dao/cartManager.js";
import cartsControl from "../controllers/cart.controller.js";
import { passportCall, authorization } from "../midsIngreso/passAuth.js";

const cartsRouter = Router();
const CM = new CartManager();


//Postea el nuevo carrito
cartsRouter.post("/", cartsControl.createNewCart.bind(cartsControl));

//Busca carrito por su ID
cartsRouter.get("/:cid", cartsControl.getThisCart.bind(cartsControl));

//Agrega el producto al carrito
cartsRouter.post("/:cid/products/:pid", passportCall('jwt'), authorization(['user']), cartsControl.addProduct.bind(cartsControl));

//Actualiza el producto por su ID
cartsRouter.put("/:cid/products/:pid", cartsControl.updateQuantity.bind(cartsControl));

//Elimina el producto del carrito
cartsRouter.delete("/:cid/products/:pid", cartsControl.deleteThisProduct.bind(cartsControl));

//Vacia el carrito
cartsRouter.delete("/:cid", cartsControl.cleanCart.bind(cartsControl));

//Compra
cartsRouter.post("/:cid/purchase", (req,res,next) => {
    console.log('Accedio a ruta de compra')
    next()
}, passportCall('jwt'), cartsControl.purchaseTicket.bind(cartsControl));

export default cartsRouter;
