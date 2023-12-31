import UserManager from "../dao/userManager.js";
import { ADMIN_EMAIL, ADMIN_PASSWORD } from "../config/configs.js";
import CartManager from "../dao/cartManager.js";

class UserService {
  constructor() {
    this.userManager = new UserManager();
    this.cartManager = new CartManager();
  }

  async registerUser({ first_name, last_name, email, age, password, role, isAdmin,cart }) {
    try {
      const role =
        email == ADMIN_EMAIL &&
        password === ADMIN_PASSWORD
          ? "admin"
          : "user";
      var cart = this.cartManager.newCart();
      const user = await this.userManager.addUser({
        first_name,
        last_name,
        email,
        age,
        password,
        role,
        cart,
        isAdmin,
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

  async restorePassword(user, hashedPassword) {
    return await this.userManager.restorePassword(user, hashedPassword);
  }
}

export default UserService;
