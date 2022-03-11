import RestaurantService from '../services/RestaurantService.js';


class RestaurantConsumer {

    constructor(channel) {
        this.channel = channel;
        this.restaurantService = new RestaurantService();
    }
    
    async AddRestaurant() {
        this.channel.consume('add-restaurant-orders', async msg => {
            const restaurant = JSON.parse(msg.content.toString());
            await this.restaurantService.AddRestaurant(restaurant);
        }, {noAck: true});
    }

    async UpdateRestaurant() {
        this.channel.consume('update-restaurant-orders', async msg => {
            const {_id, toBeUpdated} = JSON.parse(msg.content.toString());
            const {name, contacts, locationLink} = toBeUpdated;
            await this.restaurantService.UpdateRestaurant(_id, name, contacts, locationLink);
        }, {noAck: true});
    }

    async DeleteRestaurant() {
        this.channel.consume('delete-restaurant-orders', async msg => {
            const {_id} = JSON.parse(msg.content.toString());
            await this.restaurantService.DeleteRestaurant(_id);
        }, {noAck: true});
    }

}

export default RestaurantConsumer;