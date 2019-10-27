const jwt = require('jsonwebtoken');
const message = require('../config/message');
const config = require('../config/app');

function verifyRefreshToken(req, res, next) {
    if (!req.body.refreshToken)
        return res.status(401).send({ message: message.REFRESH_TOKEN_NOT_PROVIDED });

    jwt.verify(req.body.refreshToken, config.jwt.refreshSecret, function (err, decoded) {
        if (err)
            return res.status(400).send({ message: message.REFRESH_TOKEN_INVALID });

        // if everything good, save to request for use in other routes
        req.user = decoded;
        next();
    });
}

module.exports = verifyRefreshToken;