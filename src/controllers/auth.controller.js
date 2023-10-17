import AuthenticationService from "../services/auth.service.js";
import CartServices from "../services/cart.service.js";

class AuthControl {
    constructor(){
        this.authService = new AuthenticationService();
        this.cartService = new CartServices();
    }
    async login (req, res){
        const {email, password} = req.body;
        const userInfo = await this.authService.login(email, password);
        console.log("Informacion de usuario: ", userInfo);
        if(!userInfo || !userInfo.user){
         return res.status(401).json({status:"error", message: "Informacion invalida"});
        }
        if (userInfo && userInfo.user) {
            console.log("Setting session and cookie");
        req.session.user = {
            id: userInfo.user._id || userInfo.user.id,
            email: userInfo.user.email,
            first_name: userInfo.user.first_name || userInfo.user.firstName,
            last_name: userInfo.user.last_name || userInfo.user.lastName,
            rol: userInfo.user.rol,
            cart: userInfo.user.cart
        }
        }
        console.log("Full user data object:", userInfo.user);

        console.log("Assigned session:", req.session); 
    
        res.cookie("coderCookieToken", userInfo.token, {
          httpOnly: true,
          secure: false,
        });
    
        console.log("Login successful, redirecting to /profile");
        return res
          .status(200)
          .json({ status: "success", user: userInfo.user, redirect: "/profile" });
    }
    async githubCallback(req, res){
        console.log("Contolando acceso con GitHub");
        try {
            if(req.user){
                req.session.user = req.user;
                req.session.logged = true;
                return res.redirect("/profile");
            }else{
                return res.redirect("/login");
            }

        } catch (error) {
            console.error("Ocurrio un error", error);
            return res.redirect("/login")
        }
    }
    logout(req, res){
        req.session.destroy((error)=>{
            if(error){
                return res.redirect("/profile");
            }
            return res.redirect("/login")
        })
    }
}
export default AuthControl;