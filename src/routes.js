import express from 'express';

import UserController from './controllers/UsersController.js';
import RestaurantsController from './controllers/RestaurantsController.js';
import MenuItemController from './controllers/MenuItemController.js';
import EmployeeController from './controllers/EmployeesController.js';
import OrdersController from './controllers/OrdersController.js';

import KeycloakInit from './helpers/InitKeycloak.js'

const userController = new UserController();
const restaurantController = new RestaurantsController();
const menuItemController = new MenuItemController();
const employeeController = new EmployeeController();
const ordersController = new OrdersController(); 

const router = new express.Router();

const keycloak = KeycloakInit();

router.get('/users/find', async (req, res) => userController.FindUser(req, res));
router.get('/restaurants/find', async (req, res) => restaurantController.FindRestaurant(req, res));
router.get('/menu/find', async (req, res) => menuItemController.FindItem(req, res));
router.get('/employees/find', async (req, res) => employeeController.FindEmployee(req, res));

router.use(keycloak.middleware());

router.post('/order', keycloak.protect(), async (req, res) => ordersController.MakeOrder(req, res));
router.get('/find', keycloak.protect(), async (req, res) => ordersController.GetOrders(req, res));
router.put('/update', keycloak.protect(), async (req, res) => ordersController.UpdateOrder(req, res));
router.delete('/delete', keycloak.protect(), async (req, res) => ordersController.DeleteOrder(req, res));
export default router;