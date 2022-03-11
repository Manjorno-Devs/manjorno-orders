import EmployeeService from '../services/EmployeeService.js';

class EmployeeController {

    constructor() {
        this.employeeService = new EmployeeService();
    }

    async FindEmployee(req, res) {
        const {userId} = req.query; 

        const search = await this.employeeService.SearchEmployee(userId);
        res.status(200).json({search});
    }

}

export default EmployeeController;