import RestaurantService from '../services/RestaurantService.js';

class RestaurantsController {

    constructor() {
        this.restaurantService = new RestaurantService();
    }

    async FindRestaurant(req, res) {
        const {id} = req.query; 

        const search = await this.restaurantService.SearchRestaurant(id);
        res.status(200).json({search});
    }

}

export default RestaurantsController;