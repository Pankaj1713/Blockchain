let users = [];

exports.getUsers = () => users;

exports.addUser = (user) => {
    users.push(user);
    return user;
};
