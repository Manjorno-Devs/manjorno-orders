import Orders from '../models/Orders.js';
import Users from '../models/Users.js';
import Restaurants from '../models/Restaurant.js';
import MenuItem from '../models/MenuItem.js';
import Employees from '../models/Employees.js';

import mongoose from 'mongoose';
import {WebSocket} from 'ws';

class OrdersService {

    async MakeAOrder(customerId, restaurantId, items, address, phone) {
        
        const user = await Users.findOne({"userId":customerId});
        if (!user) {
            return "User does not exist!"
        }
        
        const restaurant = await Restaurants.findById(restaurantId);
        if (!restaurant) {
            return "Restaurant does not exist!";
        }

        for (let index = 0; index < items.length; index++) {
            const itemDB = await MenuItem.findById(items[index])
            if (!itemDB) {
                return `Id "${items[index]}" or No.${index} in the collection is invalid!`;
            }
        }

        const _id = mongoose.Types.ObjectId();
        await Orders.create({_id, customerId, restaurantId, items, address, phone});

        this.ws.emit('orderCreate', 'kur');
        return `Order "${_id}" created successful!`;
    }

    async GetOrderById(id, userCheckingId) {
        const order = await Orders.findById(id);
        const checkUserIfEmployee = await Employees.findOne({ "userId":userCheckingId, "restaurantId": order.restaurantId })
        if (order) {
            if ((!checkUserIfEmployee) || (checkUserIfEmployee.position !== 'manager' && checkUserIfEmployee.position !== 'owner') || (order.customerId !== userCheckingId)) {
                return "User does not have any relation with the given restaurant or does not have permitions!";
            }
            return order;
        }
        return "No orders found!";
    }

    async GetOrdersByRestaurantId(restaurantId, customerId, userCheckingId) {
        const order = await Orders.find({$or: [
                {restaurantId, customerId}, 
                {restaurantId}
            ]});
        console.log(order);
        const checkUserIfEmployee = await Employees.findOne({"userId":userCheckingId, restaurantId})
        if (order.length !== 0) {
            console.log(order);
            if ((!checkUserIfEmployee) || (checkUserIfEmployee.position !== 'manager' && checkUserIfEmployee.position !== 'owner')) {
                return "User does not have any relation with the given restaurant or does not have permitions!";
            }
            return order;
        }
        
        return "No orders found!";
    }

    async GetOrdersByCustomerId(customerId) {
        const order = await Orders.find({customerId});
        if (order.length === 0) {
            return "No orders found!";
        }
        return order;
    }

    async UpdateOrder(id, userUpdatingId) {

        const order = await Orders.findById(id);
        const employee = await Employees.findOne({"userId": userUpdatingId});

        if (!order) {
            return "Order does not exist!";
        }
        if (!employee) {
            return "User does not have any relation with the given restaurant or does not have permitions!";
        }

        if (order.delivererId && employee.userId !== order.delivererId) {
            return "Can't change order that you don't have relation to!";
        }

        switch (order.status) {
            case "Not accepted":
                await Orders.updateOne({order}, {"status":"In Progress"});
                break;
            case "In Progress":
                await Orders.updateOne({order}, {"status":"Ready for Delivery"});
                break;
            case "Ready for Delivery":
                await Orders.updateOne({order}, {"status":"Delivering"})
                break;
            case "Ready for Delivery":
                await Orders.updateOne({order}, {"status":"Delivering"})
                break;
            case "Delivering":
                await Orders.updateOne({order}, {"status":"At the address"})
            case "At the address":
                await Orders.updateOne({order}, {"status":"Delivered"});
            default:
                break;
        }
        return "Order updated successfully!";
    }

    async DeleteOrder(id, userDeletingId){
        const order = await Orders.findById(id);
        const employee = await Employees.findOne({"userId": userDeletingId});

        if (!order) {
            return "Order does not exist!";
        }
        if (!employee || employee.position === 'worker') {
            return "User does not have any relation with the given restaurant or does not have permitions!";
        }

        await Orders.deleteOne({order});
        return "Order deleted successfully!"
    }
}

export default OrdersService;