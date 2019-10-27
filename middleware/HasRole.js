const message = require('../config/message');

function hasRole(role) {
    return hasRole[role] || (hasRole[role] = function (req, res, next) {
        if (!req.user.roles || !Array.isArray(req.user.roles) || req.user.roles.indexOf(role) === -1)
            return res.status(403).send({ message: message.PERMISSION_DENIED });

        next();
    })
}

module.exports = hasRole;