import ProductManager from "../dao/ProductManager.js";
import { cartModel } from "../dao/models/cart.model.js";
import CartServices from "../services/cart.service.js";
import ticketController from "./ticket.controller.js";
import { v4 as uuidv4 } from "uuid";
import UserDTO from "../dao/dtos/user.dto.js";
import { ticketModel } from "../dao/models/ticket.model.js";

class CartController {
  constructor() {
    this.cartService = new CartServices();
    this.productClass = new ProductManager();
  }

  async createCart(req, res) {
    try {
      const newCart = await this.cartService.createCart();
      res.send(newCart);
    } catch (error) {
      res.status(500).send({
        status: "error",
        message: error.message,
      });
    }
  }

  async getCart(req, res) {
    try {
      const cart = await this.cartService.getCart(req.params.cid);
      res.send({ products: cart.products });
    } catch (error) {
      console.log("hola en cart controller");
      res.status(400).send({
        status: "error",
        message: error.message,
      });
    }
  }

  async addProductToCart(req, res) {
    try {
      const { cid, pid } = req.params;
      const result = await this.cartService.addProductToCart(cid, pid);
      res.send(result);
    } catch (error) {
      res.status(400).send({
        status: "error",
        message: error.message,
      });
    }
  }

  async updateQuantityProductFromCart(req, res) {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;
      const result = await this.cartService.updateQuantityProductFromCart(
        cid,
        pid,
        quantity
      );
      res.send(result);
    } catch (error) {
      res.status(400).send({ status: "error", message: error.message });
    }
  }

  async updateCart(req, res) {
    try {
      const cid = req.params.cid;
      const products = req.body.products;
      await this.cartService.updateCart(cid, products);
      res.send({
        status: "ok",
        message: "El producto se agregó correctamente!",
      });
    } catch (error) {
      res.status(400).send({ status: "error", message: error.message });
    }
  }

  async deleteProductFromCart(req, res) {
    try {
      const { cid, pid } = req.params;
      const result = await this.cartService.deleteProductFromCart(cid, pid);
      res.send(result);
    } catch (error) {
      res.status(400).send({ status: "error", message: error.message });
    }
  }

  async deleteProductsFromCart(req, res) {
    try {
      const cid = req.params.cid;
      const result = await this.cartService.deleteProductsFromCart(cid);
      res.send(result);
    } catch (error) {
      res.status(400).send({ status: "error", message: error.message });
    }
  }

  async createPurchaseTicket(req, res) {
    console.log("Ruta /carts/:cid/purchase accedida");

    try {
      if (!req.user || !req.user.id) {
        console.error("req.user no está definido");
        return res.status(400).json({ error: "Usuario no definido" });
      }

      const cart = await this.cartService.getCart(req.params.cid);

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

      const ticketData = {
        code: uuidv4(),
        purchase_datetime: new Date(),
        amount: totalAmount,
        purchaser: req.user.email,
      };

      const ticketCreated = await ticketController.createTicket({
        body: ticketData,
      });
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

  async getPurchase(req, res) {
    try {
      const cid = req.params.cid;
      const purchase = await this.cartService.getCart(cid);

      if (purchase) {
        res.json({ status: "success", data: purchase });
      } else {
        res
          .status(404)
          .json({ status: "error", message: "Compra no encontrada" });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ status: "error", message: "Error interno del servidor" });
    }
  }
  async purchese(req, res) {
    try {
      const { cid } = req.params;
      const infoUser = new UserDTO(req.session);
      const cartFound = await this.cartService.getCart(cid);
      if (!cartFound) {
        throw new Error('Cart not found');
      }

      const idCart = cartFound._id;

      // Calcula el total de la compra
      let cart = cartFound.products.map((item) => {
        return {
          id: item._id._id,
          title: item._id.title,
          price: item._id.price,
          quantity: item.quantity,
        };
      });
      console.log('devuelve lo de adentro del cart', cart);

      let precioTotal = 0;
      cart.forEach((producto) => {
        precioTotal += producto.price * producto.quantity;
      });

      return res.status(200).render('purchase', { cart: cart, idCart, infoUser, precioTotal });
    } catch (error) {
      console.log(error);
    }
  }

  async ticketEnd(req, res) {
    try {
      const { cid } = req.params;
      const infoUser = new UserDTO(req.session);
      const infoUserEmail = req.session.email;
      const cartFound = await this.cartService.getCart(cid);
      if (!cartFound) {
        throw new Error('Cart not found');
      }

      const idCart = cartFound._id;

      let cartConStock = [];
      let cartSinStock = [];

      /* Separo los productos con Stock y Sin stock */
      cartFound.products.forEach((item) => {
        const idProduct = item._id._id.toString();
        const title = item._id.title;
        const quantityInCart = parseInt(item.quantity);
        const availableStock = parseInt(item._id.stock);
        const productPrice = parseInt(item._id.price);

        if (quantityInCart <= availableStock) {
          const precioTotalProducto = productPrice * quantityInCart;
          cartConStock.push({ idProduct, quantity: quantityInCart, precioTotalProducto, title });
          const product = this.productClass.getProductById(idProduct);
          let quantityTotal = availableStock - quantityInCart;
          productClass.updateOne(
            idProduct,
            product.title,
            product.description,
            product.price,
            product.thumbnails,
            product.code,
            quantityTotal,
            product.category,
            product.status
          );
        } else {
          cartSinStock.push({ idProduct, quantity: quantityInCart });
        }
      });

      let precioTotal = 0;
      cartConStock.forEach((producto) => {
        precioTotal += producto.precioTotalProducto * producto.quantity;
      });

      let cart = cartConStock.map((item) => {
        return {
          id: item.idProduct,
          quantity: item.quantity,
          price: item.precioTotalProducto,
          title: item.title,
        };
      });

      const ticketData = {
        code: '',
        purchase_datetime: new Date(),
        amount: precioTotal,
        purchaser: infoUserEmail,
        products: cart,
      };

      let ticket = await ticketModel.create(ticketData);
      let code = ticket._id.toString();
      await ticketModel.findByIdAndUpdate(ticket._id, { code: code });
      await this.cartService.deleteProductsFromCart(idCart);
      const idTicket = ticket._id;
      return res.status(200).render('ticketFinal', { idTicket, cart: cart, idCart, infoUser, precioTotal });
    } catch (error) {
      console.log(error);
    }
  }
}



export default new CartController();