class UserDTO {
    constructor(user) {
      console.log("User data before creating DTO:", user);
      this.firstName = user.first_name;
      this.lastName = user.last_name;
      this.email = user.email;
      this.role = user.role;
      this.age = user.age;
      this.isAdmin = user.isAdmin;
      this.cartID = user.cart;
    }
  }
  
  export default UserDTO;