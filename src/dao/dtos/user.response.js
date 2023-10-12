export default class UserResponse{
    constructor(user){
        this.alias =  user.full_name;
        this.email = user.email;
    }
}