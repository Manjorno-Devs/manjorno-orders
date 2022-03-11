import Restaurant from "../models/Restaurant.js";
import Employees from "../models/Employees.js";
import MenuItem from "../models/MenuItem.js";

class RestaurantService{

    async AddRestaurant(restaurant){
        await Restaurant.create(restaurant);
        return "Employee added successfully!";
    }

    async SearchRestaurant(id) {
        const search = await Restaurant.findById(id);
        return search;
    }

    async UpdateRestaurant(_id, name, contacts, locationLink) {
        await Restaurant.updateOne({_id}, {name, contacts, locationLink});
        return "Employee updated successfully!"
    }

    async DeleteRestaurant(id){
        await Restaurant.findByIdAndDelete(id);
        await Employees.deleteMany({"restaurantId": id});
        await MenuItem.deleteMany({"restaurantId": id});
        return "Employee deleted successfully!";
    }
}

export default RestaurantService;