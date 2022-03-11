import jwt from 'jsonwebtoken';
import OrdersService from '../services/OrdersService.js';

class OrdersEmployee {

    constructor() {
        this.orderService = new OrdersService();
    }


    async MakeOrder(req, res){

        try {
            const {restaurantId} = req.query;
            const {items, address, phone} = req.body;

            const {sub} = jwt.decode(req.headers.authorization.split(' ')[1]);
            const customerId = sub;
            
            const response = await this.orderService.MakeAOrder(customerId, restaurantId, items, address, phone);
            if (response === "User does not exist!") {
                res.status(404).json({response});
                return;
            }
            if (response === "Restaurant does not exist!") {
                res.status(404).json({response});
                return;
            }
            if (response.startsWith("Id")) {
                res.status(404).json({response});
                return;
            }

            res.status(200).json({response});
        } catch (error) {
            error = error.message;
            res.status(500).json({error});
        }
        
    }

    async GetOrders(req, res) {
        try {
            const {id, restaurantId, customerId} = req.query;

            const {sub} = jwt.decode(req.headers.authorization.split(' ')[1]);
            const userCheckingId = sub;

            if (id) {
                const search = await this.orderService.GetOrderById(id, userCheckingId);

                if (search === "No orders found!") {
                    res.status(404).json({search});
                    return;
                
                }

                if (search === "User does not have any relation with the given restaurant or does not have permitions!") {
                    res.status(403).json({search});
                    return;
                }

                res.status(200).json({search});
                return;

            } else if (restaurantId) {
                const search = await this.orderService.GetOrdersByRestaurantId(restaurantId, customerId, userCheckingId);

                if (search === "No orders found!") {
                    res.status(404).json({search});
                    return;
                
                }

                if (search === "User does not have any relation with the given restaurant or does not have permitions!") {
                    res.status(403).json({search});
                    return;
                }

                res.status(200).json({search});
                return;
                
            }

            const search = await this.orderService.GetOrdersByCustomerId(userCheckingId);

                if (search === "No orders found!") {
                    res.status(404).json({search});
                    return;
                }

                if (search === "User does not have any relation with the given restaurant or does not have permitions!") {
                    res.status(403).json({search});
                    return;
                }

                res.status(200).json({search});

        } catch (error) {
            console.log(error);
            error = error.message;
            res.status(500).json({error});
        }
    }


    async UpdateOrder(req, res) {
        const {id} = req.query;
        const {sub} = jwt.decode(req.headers.authorization.split(' ')[1]);
        const userUpdatingId = sub;

        const response = await this.orderService.UpdateOrder(id, userUpdatingId);

        if (response === "Order does not exist!") {
            res.status(404).json({response});
            return;
        }
        if (response === "User does not have any relation with the given restaurant or does not have permitions!") {
            res.status(403).json({response});
            return;            
        }
        if (response === "Can't change order that you don't have relation to!") {
            res.status(403).json({response});
            return;
        }

        res.status(200).json({response});
    }

    async DeleteOrder(req, res) {
        const {id} = req.query;
        const {sub} = jwt.decode(req.headers.authorization.split(' ')[1]);
        const userDeleteingId = sub;

        const response = await this.orderService.DeleteOrder(id, userDeleteingId);

        if (response === "Order does not exist!") {
            res.status(404).json({response});
            return;
        }
        if (response === "User does not have any relation with the given restaurant or does not have permitions!") {
            res.status(403).json({response});
            return;            
        }

        res.status(200).json({response});
        
    }
}

export default OrdersEmployee;