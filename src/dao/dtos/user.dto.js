export default class UserDto{
    constructor(user){
        this._id = user._id
        this.first_name = user.first_name
        this.last_name = user.last_name
        this.full_name =  `${user.first_name} ${user.last_name}`;
        this.rol = user.rol;
        this.email = user.email;
        this.password = user.password;
        this.cartIdentificador = user.cart
    }
}