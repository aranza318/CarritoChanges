import express from "express";
import ProductManager from "../dao/ProductManager.js";
import CartManager from "../dao/cartManager.js";
import cartController from "../controllers/cart.controller.js";


const router = express.Router();
const PM = new ProductManager();
const CM = new CartManager()

const checkSession = (req, res, next) => {
 
  console.log('Checking session:', req.session);

  if (req.session && req.session.user) {
    console.log('Session exists:', req.session.user);
    next();
  } else {
    console.log('No session found, redirecting to /login');
    res.redirect("/login");
  }
};

const checkAlreadyLoggedIn = (req, res, next) => {
 
  if (req.session && req.session.user) {
    console.log("Usuario ya autenticado, redirigiendo a /profile");
    res.redirect("/profile");
  } else {
    console.log("Usuario no autenticado, procediendo...");
    next();
  }
};

//Acceso a home que ahora es login ya que no puede ver los productos quien no este registrado
router.get("/", async (req, res) => {
  const products = await PM.getProducts(req.query);
  res.render("login");
});

//Acceso a products
router.get("/products", async (req, res) => {
  const products = await PM.getProducts(req.query);
  const user = req.session.user;
  res.render("products", {products, user});
});

//Acceso a producto por su ID
router.get("/products/:pid", async (req, res) => {
  const pid = req.params.pid;
  const product = await PM.getProductById(pid);
  if (product){
  res.render("productDetail", { product });
  } else {
    res.status(404).send({status:"error", message:"Producto no encontrado"})
  }
});

//Acceso a cart por su ID
router.get("/carts/:cid", async (req, res) => {
  const cid = req.params.cid;
  const cart = await CM.getCart(cid);

  if (cart) {
    console.log(JSON.stringify(cart, null, 4));
    res.render("cart", { products: cart.products });
  } else {
    res.status(400).send({
      status: "error",
      message: "Error! No se encuentra el ID de Carrito!",
    });
  }
});

//Acceso al sector compra
router.post("/carts/:cid", async (req,res)=>{
  const cid = req.params.cid;
  cartController.getPurchase(req,res,cid);
})

//Acceso al formulario
router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
});

//Acceso a chat
router.get("/chat", (req, res) => {
  res.render("chat");
});

//Acceso al login
router.get("/login",checkAlreadyLoggedIn, async (req, res) => {
  res.render("login");
});

//Acceso al registro
router.get("/register",checkAlreadyLoggedIn, async (req, res) => {
  res.render("register");
});

//Acceso al profile
router.get("/profile",checkSession, (req, res) => {
  const userData = req.session.user;
  res.render("profile", {user:userData});
});

//Acceso a restore de pass
router.get("/restore", checkSession, (req, res) => {
  res.render("restore");
});

//Fallo de ingreso
router.get("/faillogin", (req, res) =>{
  res.status(401).json({
      status:"error",
      message: "Error en el ingreso al sitio con ese mail y contraseña"
  });
})


export default router;
