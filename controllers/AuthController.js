const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const config = require('../config/app');
const message = require('../config/message');
const User = require('../models/User');
const tokenList = {};

// Login user and return a token
function login(req, res) {
    User.findOne({ $or: [{ name: req.body.username }, { email: req.body.username }], provider: null }, function (err, user) {
        if (err) return res.status(500).send({ message: message.INTERNAL_SERVER_ERROR });
        if (!user || !bcrypt.compareSync(req.body.password, user.password))
            return res.status(401).send({ message: message.INVALID_LOGIN_CREDENTIALS });

        // create a token
        let payload = { id: user._id, role: user.role };
        let token = jwt.sign(payload, config.jwt.secret, {
            expiresIn: config.jwt.ttl
        });
        let refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
            expiresIn: config.jwt.refreshTtl
        });

        tokenList[refreshToken] = { token }
        return res.status(200).send({ token, refreshToken });
    });
};

// Logout user
function logout(req, res) {
    let refreshToken = req.body.refreshToken;

    // delete refresh token from list
    if (refreshToken in tokenList)
        delete tokenList[refreshToken];

    return res.status(200).send({ token: null });
}

// Refresh JWT token
function refresh(req, res) {
    let refreshToken = req.body.refreshToken;

    if (refreshToken in tokenList) {
        // create a token
        let payload = { id: req.user.id, role: req.user.role };
        let token = jwt.sign(payload, config.jwt.secret, {
            expiresIn: config.jwt.ttl
        });

        tokenList[refreshToken].token = token;
        return res.status(200).send({ token });
    }

    return res.status(404).send({ message: message.REFRESH_TOKEN_INVALID });
}

// Register a new user
async function register(req, res) {
    let user = new User(req.body);
    const err = user.validateSync();
    if (err) return res.status(422).send(err);

    let alreadyExists = await User.where({ $or: [{ name: user.name }, { email: user.email }] }).countDocuments();
    if (alreadyExists)
        return res.status(409).send({ message: message.USER_ALREADY_EXISTS });

    user.password = bcrypt.hashSync(req.body.password);
    user.save(function (err, user) {
        if (err) return res.status(500).send({ message: message.INTERNAL_SERVER_ERROR });
        return res.status(200).send({ message: message.REGISTER_SUCCESS });
    });
};

// Get authenticated user
function user(req, res) {
    User.findById(req.user.id, { _id: 0, __v: 0, password: 0, passwordReset: 0 }, function (err, user) {
        if (err) return res.status(500).send({ message: message.INTERNAL_SERVER_ERROR });
        if (!user) return res.status(404).send({ message: message.USER_NOT_FOUND });

        return res.status(200).send({ user });
    });
};

module.exports = {
    login, logout, refresh, register, user
};