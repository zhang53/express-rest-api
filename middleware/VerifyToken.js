const jwt = require('jsonwebtoken');
const message = require('../config/message');
const config = require('../config/app');

function verifyToken(req, res, next) {
    if (!req.headers.authorization)
        return res.status(401).send({ message: message.TOKEN_NOT_PROVIDED });

    // Validate bearar token
    if (req.headers.authorization.toLowerCase().indexOf("bearer ") != 0)
        return res.status(401).send({ message: message.TOKEN_INVALID });

    // Get JWT token from Bearer one
    let token = req.headers.authorization.split(' ')[1];

    jwt.verify(token, config.jwt.secret, function (err, decoded) {
        if (err)
            return res.status(401).send({ message: message.TOKEN_UNAUTHORIZED, refresh: true });

        // if everything good, save to request for use in other routes
        req.user = decoded;
        next();
    });
}

module.exports = verifyToken;