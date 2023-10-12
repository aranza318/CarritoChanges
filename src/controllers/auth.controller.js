import AuthenticationService from "../services/auth.service.js";

class AuthControl {
    constructor(){
        this.authService = new AuthenticationService();

    }
    async login (req, res){
        const {email, password} = req.body;
        const userInfo = await this.authService.login(email, password);
        console.log("Informacion de usuario: ", userInfo);
        if(!userInfo || !userInfo.user){
         return res.status(401).json({status:"error", message: "Informacion invalida"});
        }
        req.session.user = {
            id: userInfo.user._id,
            email: userInfo.user.email,
            first_name: userInfo.user.first_name,
            last_name: userInfo.user.last_name,
            rol: userInfo.user.rol
        }
        req.session.logged = true
        req.session.adim = true
        

        console.log("Rol: ", userInfo.user.rol);
        return res.status(200).json({status:"success", user: userInfo.user, redirect: "/profile"});
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