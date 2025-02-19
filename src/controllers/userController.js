import { getUsers, addUser } from '../services/userService.js';
import { sendResponse } from '../helpers/responseHelper.js';

export const getAllUsers = (req, res) => {
    const users = getUsers();
    sendResponse(res, 200, 'Users fetched successfully', users);
};

export const createUser = (req, res) => {
    const user = addUser(req.body);
    sendResponse(res, 201, 'User created successfully', user);
};
