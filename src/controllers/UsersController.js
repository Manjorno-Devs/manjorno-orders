import UserService from '../services/UsersService.js';

class UserController {

    constructor() {
        this.userService = new UserService();
    }

    async FindUser(req, res) {
        const {userId} = req.query; 

        const search = await this.userService.FindUser(userId);
        res.status(200).json({search});
    }

}

export default UserController;