import { isValidPassword, createHash } from "../midsIngreso/bcrypt.js";
import usersModel from "./models/user.model.js";
import UserDto from "./dtos/user.dto.js";

class UserManager {
    //Agrega un nuevo usuario
    async addUser({first_name, last_name, email, age, password, rol}) {
        try {
            const exists = await usersModel.findOne({email});
            if(exists){
                console.log("Este usuario ya existe");
                return null;
            }
            const hash = createHash(password); 
           
            const user = await usersModel.create({
                first_name,
                last_name,
                email,
                age,
                password:hash,
                rol
            });
           
            console.log("Usuario agregado", user);
            return new UserDto(user); 
        } catch (error) {
            console.error("Error al agregar al usuario ", error);
            throw error;
        }
    }
    //Login
    async login(user, pass) {
        try {
          const userLogged = await usersModel.findOne({ email: user });
    
          if (userLogged && isValidPassword(userLogged, pass)) {
            return new UserDto(userLogged); 
        }
          return null;
        } catch (error) {
          console.error("Error during login:", error);
          throw error;
        }
      }
    //Consigue el usuario por su email
    async getUserByEmail(user) {
        try {
            const userRegisteredBefore= await usersModel.findOne([{email:user}]) || null;
             if(userRegisteredBefore){
                console.log("Mail registrado anteriormente");
                return user
             }
            
            return true;
        } catch (error) {
            return false;
        }
      
    }
    //Conseguir Usuario por su ID

    //Restore Password
    async restorePassword(email, hashP) {
        try {
            const userLogged = await usersModel.updateOne({email:email}, {password:hashP}) || null;
            
            if (userLogged) {
                console.log("Password Restored!");
                return ({status:200, redirect:"/profile"});
            }

            return false;
        } catch (error) {
            return false;
        }
    }
    
    //Obtiene el campo solicitado
    async obtenerSegunCampo({campo,valor}) {
        const criterio = {}
        criterio[campo] = valor
        const buscado = await usersModel.findOne(criterio).lean()
        if (!buscado) {
            throw new Error("no encontrado")
        } else {
            return buscado
        }

    }
};
    

export default UserManager;