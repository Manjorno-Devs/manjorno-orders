import MenuItem from '../models/MenuItem.js';

class MenuItemService {

    async AddItem(item){
        await MenuItem.create(item);
        return "Employee added successfully!";
    }

    async SearchItem(id){
        const search = MenuItem.findById(id);
        return search;
    }

    async UpdateItem(_id, name, price) {
        await MenuItem.findByIdAndUpdate(_id, {name, price});
        return "Employee updated successfully!"
    }

    async DeleteItem(_id){
        await MenuItem.findByIdAndDelete(_id);
        return "Employee deleted successfully!";
    }

}

export default MenuItemService;