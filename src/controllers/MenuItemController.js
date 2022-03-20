import MenuItemService from '../services/MenuItemService.js';

class MenuItemController {

    constructor() {
        this.menuItemService = new MenuItemService();
    }

    async FindItem(req, res) {
        const {id, restaurantId} = req.query; 

        const search = await this.menuItemService.SearchItem(id, restaurantId);
        res.status(200).json({search});
    }

}

export default MenuItemController;