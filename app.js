import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import amqp from 'amqplib/callback_api.js';
import mongoose from 'mongoose';

import routes from './src/routes.js';
import UserConsumer from './src/rabbitmq/consumer-users.js';
import RestaurantConsumer from './src/rabbitmq/consumer-restaurant.js';
import EmployeeConsumer from './src/rabbitmq/consumer-employee.js';
import MenuItemConsumer from './src/rabbitmq/consumer-menuItem.js';

import { WebSocket } from 'ws';
const env = dotenv.config();

const app = new express();

app.use(cors());
app.use(express.json());

app.use('/api/orders', routes);

const port = process.env.PORT || 3300;


amqp.connect(process.env.AMQP_CONNECTION_URL, (connectionError, connection) => {
    if (connectionError) {
        throw connectionError;
    }
    connection.createChannel((channelError, channel) => {
        if (channelError) {
            throw channelError;
        }
        

        console.log('Connected to RabbitMQ');

        const queues = [
            'add-user-orders', 
            'update-user-orders', 
            'delete-user-orders', 
            'add-restaurant-orders', 
            'update-restaurant-orders', 
            'delete-restaurant-orders', 
            'add-employee-orders', 
            'update-employee-orders', 
            'delete-employee-orders',
            'add-menuItem-orders',
            'update-menuItem-orders',
            'delete-menuItem-orders'
        ];

        queues.forEach(queueName => {
            channel.assertQueue(queueName, { durable: false });
        });

        channel.bindQueue('add-user-orders', process.env.AMQP_EXCHANGE_USERS, 'KK.EVENT.ADMIN.Manjorno.SUCCESS.USER.CREATE');
        channel.bindQueue('add-user-orders', process.env.AMQP_EXCHANGE_USERS, 'KK.EVENT.CLIENT.Manjorno.SUCCESS.account-console.REGISTER');
        channel.bindQueue('update-user-orders', process.env.AMQP_EXCHANGE_USERS, 'KK.EVENT.ADMIN.Manjorno.SUCCESS.USER.UPDATE');
        channel.bindQueue('delete-user-orders', process.env.AMQP_EXCHANGE_USERS, 'KK.EVENT.ADMIN.Manjorno.SUCCESS.USER.DELETE');

        channel.bindQueue('add-restaurant-orders', process.env.AMQP_EXCHANGE_RESTAURANTS, 'add');
        channel.bindQueue('update-restaurant-orders', process.env.AMQP_EXCHANGE_RESTAURANTS, 'update');
        channel.bindQueue('delete-restaurant-orders', process.env.AMQP_EXCHANGE_RESTAURANTS, 'delete');

        channel.bindQueue('add-employee-orders', process.env.AMQP_EXCHANGE_EMPLOYEES, 'add');
        channel.bindQueue('update-employee-orders', process.env.AMQP_EXCHANGE_EMPLOYEES, 'update');
        channel.bindQueue('delete-employee-orders', process.env.AMQP_EXCHANGE_EMPLOYEES, 'delete');

        channel.bindQueue('add-menuItem-orders', process.env.AMQP_EXCHANGE_MENUITEM, 'add');
        channel.bindQueue('update-menuItem-orders', process.env.AMQP_EXCHANGE_MENUITEM, 'update');
        channel.bindQueue('delete-menuItem-orders', process.env.AMQP_EXCHANGE_MENUITEM, 'delete');

        const userConsumer = new UserConsumer(channel);
        userConsumer.AddUser();
        userConsumer.UpdateUser();
        userConsumer.DeleteUser();

        const restaurantConsumer = new RestaurantConsumer(channel);
        restaurantConsumer.AddRestaurant();
        restaurantConsumer.UpdateRestaurant();
        restaurantConsumer.DeleteRestaurant();

        const employeeConsumer = new EmployeeConsumer(channel);
        employeeConsumer.AddEmployee();
        employeeConsumer.UpdateEmployee();
        employeeConsumer.DeleteEmployee();

        const menuItemConsumer = new MenuItemConsumer(channel);
        menuItemConsumer.AddItem();
        menuItemConsumer.UpdateItem();
        menuItemConsumer.DeleteItem();

        mongoose.connect(process.env.MONGODB_CONNECTION_URL, () => {
            console.log("Connected to DB");
            app.listen(port, () => {
                console.log(`Microservice is up at port ${port}`);
            });
        });
    });
});

