const userService = require('../services/userService');
const responseHelper = require('../helpers/responseHelper');

exports.getAllUsers = (req, res) => {
    const users = userService.getUsers();
    responseHelper.sendResponse(res, 200, 'Users fetched successfully', users);
};

exports.createUser = (req, res) => {
    const user = userService.addUser(req.body);
    responseHelper.sendResponse(res, 201, 'User created successfully', user);
};
