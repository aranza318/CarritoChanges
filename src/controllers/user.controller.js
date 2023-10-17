import { createHash } from "../midsIngreso/bcrypt.js";
import UserService from "../services/user.service.js";
import UserResponse from "../dao/dtos/user.response.js";
import CartServices from "../services/cart.service.js";

class UserController {
    constructor (){
        this.userService = new UserService();
        this.cartService = new CartServices();
    }
    async register(req, res) {
        const { first_name, last_name, email, age, password, rol, cart } = req.body;
        const response = await this.userService.register({
          first_name,
          last_name,
          email,
          age,
          password,
          rol,
          cart
        });
        const newCart = await this.cartService.creatNewCart()
        const newUser = { ...req.body, cart: newCart }
        console.log(newUser);
        return res.status(response.status === "success" ? 200 : 400).json(response);
      }
    async restore(req, res){
        const {user, pass} = req.query;
        try {
            const newPass = await this.userService.restorePass(user, createHash(pass));
            if(newPass){
                return res.send({status:"ok", message: "Contraseña nueva guarda correctamente"});
                location.href = "/profile"
            }else{
                return res.status(401).send({status:"error", message:"No se pudo actualizar la contraseña"});

            }
        } catch (error) {
            console.log(error);
            return res.status(500).send({status:"error", message:"Error Interno"})
        }
    }
    current(req, res){
        if(req.user){
            return res.send({status:"ok", payload:new UserResponse(req.session.user)});
        }else{
            return res.status(401).send({status:"error", message: "No tiene autoriacion para acceder"})
        }
    }
}

export default UserController;
