let users = [];

export const getUsers = () => users;

export const addUser = (user) => {
    users.push(user);
    return user;
};
