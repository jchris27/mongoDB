// MODEL-VIEW-CONTROLLER (MVC) PATTERN

// get the data from the database
const Employee = require('../model/Employee');

const getAllEmployees = async (req, res) => {
    const employees = await Employee.find();
    if (!employees) return res.status(204).json({ 'message': 'No employees found.' });
    res.json(employees);
};

const createNewEmployee = async (req, res) => {
    // increment id by 1 or default to 1
    // const newEmployee = {
    //     id: data.employees?.length ? data.employees[data.employees.length - 1].id + 1 : 1, 
    //     firstname: req.body.firstname,
    //     lastname: req.body.lastname
    // };

    // send a response error if requirements are missing
    if (!req?.body?.firstname || !req?.body?.lastname) {
        return res.status(400).json({ 'message': 'First and last name are required.' });
    };

    try {
        const result = await Employee.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname
        });

        res.status(201).json(result); // 201 means success in creating a new employee
    } catch (err) {
        console.log(err);
    };
};

const updateEmployee = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ 'message': 'ID parameter is required.' });

    // find an employee by id
    const employee = await Employee.findOne({ _id: req.body.id }).exec();

    // if no employee found send an error
    if (!employee) {
        return res.status(204).json({ "message": `No employee matches ID ${req.body.id}.` });
    };

    // update the data
    if (req.body?.firstname) employee.firstname = req.body.firstname;
    if (req.body?.lastname) employee.lastname = req.body.lastname;

    const result = await employee.save();
    res.status(200).json(result);

    // data.setEmployees(unsortedArray.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
};

const deleteEmployee = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ 'message': 'Employee ID required.' });

    const employee = await Employee.findOne({ _id: req.body.id }).exec();

    if (!employee) {
        return res.status(204).json({ "message": `No employee matches ID ${req.body.id}.` });
    };

    const result = await Employee.deleteOne({ _id: req.body.id });
    res.status(200).json(result);
};

const getEmployee = async (req, res) => {
    // Use req.params.id to get the id from the URL not req.body.id
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Employee ID required.' });
    const employee = await Employee.findOne({ _id: req.params.id }).exec();

    if (!employee) {
        return res.status(204).json({ "message": `No employee matches ID ${req.params.id}.` });
    };

    res.json(employee);
};

module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
};