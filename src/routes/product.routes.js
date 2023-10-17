import { Router } from "express";
import ProductManager from "../dao/ProductManager.js";
import ProductsServices from "../services/products.service.js";
import productsController from "../controllers/products.controller.js";
import { passportCall, authorization } from "../midsIngreso/passAuth.js";

const productsRouter = Router();
const PM = new ProductManager();
const productService = new ProductsServices();

productsRouter.get("/", productsController.getProducts.bind(productsController));
productsRouter.get(
  "/:pid",
  productsController.getByID.bind(productsController)
);
productsRouter.post('/',passportCall('jwt'), authorization(['admin']), productsController.addProduct.bind(productsController));
productsRouter.put('/:pid',passportCall('jwt'), authorization(['admin']), productsController.updateProd.bind(productsController));
productsRouter.delete('/:pid',passportCall('jwt'), authorization(['admin']), productsController.deleteProd.bind(productsController));

export default productsRouter;