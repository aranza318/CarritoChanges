import { Router } from "express";
import ProductManager from "../dao/ProductManager.js";
import ProductsServices from "../services/products.service.js";
import productsController from "../controllers/products.controller.js";
import { isAdmin } from "../midsIngreso/auth.js";

const productsRouter = Router();
const PM = new ProductManager();
const productService = new ProductsServices();

productsRouter.get("/", isAdmin, productsController.getProducts.bind(productsController));
productsRouter.get(
  "/:pid",
  productsController.getProductById.bind(productsController)
);
productsRouter.post('/', isAdmin, productsController.addProduct.bind(productsController));
productsRouter.put('/:pid',isAdmin, productsController.updateProduct.bind(productsController));
productsRouter.delete('/:pid',isAdmin, productsController.deleteProduct.bind(productsController));

export default productsRouter;