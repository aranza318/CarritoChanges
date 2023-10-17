import UserManager from "../dao/userManager.js";

class UserService {
    constructor(){
        this.usersManager = new UserManager();

    }

    async register({ first_name, last_name, email, age, password, rol }) {
      try {
        
        const user = await this.usersManager.addUser({
          first_name,
          last_name,
          email,
          age,
          password,
          rol,
        });
  
        if (user) {
          return { status: "success", user, redirect: "/login" };
        } else {
          return { status: "error", message: "User already exists" };
        }
      } catch (error) {
        console.error("Error registering user:", error);
        return { status: "error", message: "Internal Server Error" };
      }
    }
    
    async restorePass (user, hashP){
      const clave = await this.usersManager.restorePassword(user, hashP)
      if(clave){
         return { status: "success", clave, redirect: "/profile" };
      }
    }
    
}



export default UserService;