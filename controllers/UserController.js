const bcrypt = require('bcryptjs');

const message = require('../config/message');
const User = require('../models/User');

// Create a new user
async function create(req, res) {
    let user = new User(req.body);
    const err = user.validateSync();
    if (err) return res.status(422).send(err);

    let alreadyExists = await User.where({ email: user.email }).countDocuments();
    if (alreadyExists)
        return res.status(409).send({ message: message.USER_ALREADY_EXISTS });

    user.password = bcrypt.hashSync(req.body.password);
    user.save(function (err, user) {
        if (err) return res.status(500).send({ message: message.INTERNAL_SERVER_ERROR });
        return res.status(200).send({ message: message.USER_CREATED });
    });
}

// Get all the users in the database
function all(req, res) {
    User.find({}, function (err, users) {
        if (err) return res.status(500).send({ message: message.INTERNAL_SERVER_ERROR });
        return res.status(200).send({ users });
    });
}

// Get a single user in the database
function one(req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err) return res.status(500).send({ message: message.INTERNAL_SERVER_ERROR });
        if (!user) return res.status(404).send({ message: message.USER_NOT_FOUND });
        return res.status(200).send({ user });
    });
}

// Delete a user from the database
function remove(req, res) {
    User.findByIdAndRemove(req.params.id, { useFindAndModify: false }, function (err, user) {
        if (err) return res.status(500).send({ message: message.INTERNAL_SERVER_ERROR });
        if (!user) return res.status(404).send({ message: message.USER_NOT_FOUND });
        return res.status(200).send({
            message: message.USER_DELETED,
            data: {
                email: user.email
            }
        });
    });
}

// Update a single user from the database
function update(req, res) {
    User.findByIdAndUpdate(req.params.id, req.body, { useFindAndModify: false }, function (err, user) {
        if (err) return res.status(500).send({ message: message.INTERNAL_SERVER_ERROR });
        if (!user) return res.status(404).send({ message: message.USER_NOT_FOUND });
        return res.status(200).send({ message: message.USER_UPDATED });
    });
}

module.exports = {
    create, all, one, remove, update
};