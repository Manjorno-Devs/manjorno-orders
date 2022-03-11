import Employees from "../models/Employees.js";

class EmployeesService{

    async AddEmployee(employee){
        await Employees.create(employee);
        return "Employee added successfully!";
    }

    async SearchEmployee(userId){
        const search = await Employees.findOne({userId});
        return search;
    }

    async UpdateEmployee(restaurantId, userId, position, workingHere) {
        await Employees.updateOne({restaurantId, userId}, {position, workingHere});
        return "Employee updated successfully!"
    }

    async DeleteEmployee(restaurantId, userId){
        await Employees.deleteOne({restaurantId, userId});
        return "Employee deleted successfully!";
    }
}

export default EmployeesService;