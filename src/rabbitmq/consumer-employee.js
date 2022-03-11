import EmployeesService from "../services/EmployeeService.js";

class EmployeeConsumer {

    constructor(channel) {
        this.channel = channel;
        this.employeeService = new EmployeesService();
    }
    
    async AddEmployee() {
        this.channel.consume('add-employee-orders', async msg => {
            const employee = JSON.parse(msg.content.toString());
            await this.employeeService.AddEmployee(employee);
        }, {noAck: true});
    }

    async UpdateEmployee() {
        this.channel.consume('update-employee-orders', async msg => {
            const {userId, restaurantId, position, workingHere} = JSON.parse(msg.content.toString());
            await this.employeeService.UpdateEmployee(restaurantId, userId, position, workingHere);
        }, {noAck: true});
    }

    async DeleteEmployee() {
        this.channel.consume('delete-employee-orders', async msg => {
            const {userId, restaurantId} = JSON.parse(msg.content.toString());
            await this.employeeService.DeleteEmployee(restaurantId, userId);
        }, {noAck: true});
    }

}

export default EmployeeConsumer;