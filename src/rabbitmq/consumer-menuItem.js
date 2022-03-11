import MenuItemService from "../services/MenuItemService.js";

class MenuItemConsumer {

    constructor(channel) {
        this.channel = channel;
        this.menuItemService = new MenuItemService();
    }

    async AddItem() {
        this.channel.consume('add-menuItem-orders', async msg => {
            const item = JSON.parse(msg.content.toString());
            await this.menuItemService.AddItem(item);
        }, {noAck: true});
    }

    async UpdateItem() {
        this.channel.consume('update-menuItem-orders', async msg => {
            const {_id, name, price} = JSON.parse(msg.content.toString());
            await this.menuItemService.UpdateItem(_id, name, price);
        }, {noAck: true});
    }

    async DeleteItem() {
        this.channel.consume('delete-menuItem-orders', async msg => {
            const {_id} = JSON.parse(msg.content.toString());
            console.log(JSON.parse(msg.content.toString()));
            console.log(_id);
            await this.menuItemService.DeleteItem(_id);
        }, {noAck: true});
    }

}

export default MenuItemConsumer;