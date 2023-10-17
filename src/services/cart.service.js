import CartManager from "../dao/cartManager.js";

class CartServices{
    constructor(){
       this.cartManager = new CartManager();
    }
    async creatNewCart (){
        return await this.cartManager.newCart();

    }
    async getByID(id){
        return await this.cartManager.getCart(id);

    }
    async addNewProduct(cid,pid){
        const resultado = await this.cartManager.addProductToCart(cid, pid);
        if(resultado){
            return {status:"ok", message: "Producto agregado al carrito"}
        }else{
            throw new Error("Error al agregar este producto al carrito")
        }
    }
    async updateQuantity(cid, pid, quantity){
        const result = await this.cartManager.updateQuantityProductFromCart(cid, pid, quantity);
        if (result) {
          res.send({status: "ok", message: "El producto se actualizó correctamente"});
        } else {
          res.status(400).send({status: "error", message: "Error: No se pudo actualizar el producto del carrito"});
        }
        return await this.cartManager.updateQuantityProductFromCart(cid, pid, quantity)
    };
    async updateCart(cartId, products) {
      const result = await this.cartManager.updateProducts(cartId, products);
      if (result) {
        return { status: "ok", message: "El carrito se actualizó correctamente" };
      } else {
        throw new Error("Error: No se pudo actualizar el carrito");
      }
    }
    async deleteProduct(cid, pid){
        const result = await this.cartManager.deleteProductFromCart(cid, pid);
        if (result) {
            res.send({
              status: "ok",
              message: "El producto se eliminó correctamente",
            });
          } else {
            res.status(400).send({
              status: "error",
              message: "Error: No se pudo eliminar el producto del carrito",
            });
          }
        return await this.cartManager.deleteProductFromCart(cid, pid);
    };
    async cleanCart(cid){
        const result = await this.cartManager.deleteProductsFromCart(cid);

        if (result) {
          res.send({ status: "ok", message: "El carrito se vació correctamente!" });
        } else {
          res.status(400).send({
            status: "error",
            message: "Error! No se pudo vaciar el Carrito!",
          });
        }
        return await this.cartManager.deleteProductsFromCart(cid);
    };
    
    

}

export default CartServices;