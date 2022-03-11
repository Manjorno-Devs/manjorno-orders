import MenuItemService from '../services/MenuItemService.js';

class MenuItemController {

    constructor() {
        this.menuItemService = new MenuItemService();
    }

    async FindItem(req, res) {
        const {id} = req.query; 

        const search = await this.menuItemService.SearchItem(id);
        res.status(200).json({search});
    }

}

export default MenuItemController;