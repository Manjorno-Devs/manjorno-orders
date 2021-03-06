import UserService from '../services/UsersService.js';

const userService = new UserService();

class UserConsumer {

    constructor(channel) {
        this.channel = channel;
    }
    
    async AddUser() {
        this.channel.consume('add-user-orders', async msg => {
            const {userId, details, representation, resourcePath} = JSON.parse(msg.content.toString());
            if (!details) {
                const userId = resourcePath.split('/')[1];
                const {username, firstName, lastName, email} = JSON.parse(representation);
                await userService.AddUser(userId, username, email, firstName, lastName);
            } else {
                const {username, first_name, last_name, email} = details;
                await userService.AddUser(userId, username, email, first_name, last_name);
            }
        }, {noAck: true});
    }

    async UpdateUser() {
        this.channel.consume('update-user-orders', async msg => {
            const {resourcePath, representation} = JSON.parse(msg.content.toString());
            console.log(msg.content.toString());
            const userId = resourcePath.split('/')[1];
            const {username, email, firstName, lastName} = JSON.parse(representation);
            await userService.UpdateUser(userId, username, email, firstName, lastName);
        }, {noAck: true});
    }

    async DeleteUser() {
        this.channel.consume('delete-user-orders', async msg => {
            const {resourcePath} = JSON.parse(msg.content.toString());
            const userId = resourcePath.split('/')[1];
            await userService.DeleteUser(userId);
        }, {noAck: true});
    }

}

export default UserConsumer;