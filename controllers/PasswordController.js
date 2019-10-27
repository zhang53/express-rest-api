const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const config = require('../config/app');
const message = require('../config/message');
const mailer = require('../helpers/mailer');
const User = require('../models/User');

// Generate the password reset token and send reset link to email
async function forgot(req, res) {
    try {
        let user = await User.findOne({ email: req.body.email, provider: null });
        if (!user) return res.status(404).send({ message: message.USER_NOT_FOUND });

        // generates a password reset token with 68 characters
        let token = crypto.randomBytes(34).toString('hex');
        // password reset token expires in an hour
        let expire = new Date().addSeconds(3600);

        // store password reset token
        user.passwordReset = { token, expire };
        await user.save();

        // send password reset notification email
        mailer.sendMail(user.email, 'Reset Password Notification', 'reset-password', {
            name: user.name,
            resetLink: `${config.siteUrl}/password/reset?token=${token}&email=${user.email}`
        });

        return res.status(200).send({ message: message.PASSWORD_RESET_LINK_SENT });
    } catch (err) {
        return res.status(500).send({ message: message.INTERNAL_SERVER_ERROR });
    }
}

// Validate the password reset token and reset the password
async function reset(req, res) {
    if (!req.body.token) return res.status(422).send({ message: message.PASSWORD_RESET_TOKEN_NOT_PROVIDED });

    try {
        let user = await User.findOne({
            email: req.body.email,
            "passwordReset.token": req.body.token
        });
        if (!user) return res.status(404).send({ message: message.PASSWORD_RESET_TOKEN_INVALID });
        if (new Date().isAfter(user.passwordReset.expire))
            return res.status(400).send({ message: message.PASSWORD_RESET_TOKEN_EXPIRED });

        // delete password reset token and reset password with new one
        user.passwordReset = null;
        user.password = bcrypt.hashSync(req.body.password);
        await user.save();

        // send password changed notification email
        mailer.sendMail(user.email, 'Password Changed Notification', 'password-changed', {
            name: user.name
        });

        return res.status(200).send({ message: message.PASSWORD_RESET_SUCCESS });
    } catch (err) {
        return res.status(500).send({ message: message.INTERNAL_SERVER_ERROR });
    }
}

// Change my password
async function change(req, res) {
    User.findById(req.user.id, async function (err, user) {
        if (err) return res.status(500).send({ message: message.INTERNAL_SERVER_ERROR });
        if (!user) return res.status(404).send({ message: message.USER_NOT_FOUND });
        if (!bcrypt.compareSync(req.body.currentPassword, user.password))
            return res.status(401).send({ message: message.INVALID_PASSWORD });

        // reset password with the new one
        user.password = bcrypt.hashSync(req.body.newPassword);
        await user.save();

        // send password changed notification email
        mailer.sendMail(user.email, 'Password Changed Notification', 'password-changed', {
            firstName: user.firstName
        });

        return res.status(200).send({ message: message.PASSWORD_RESET_SUCCESS });
    });
}

module.exports = {
    forgot, reset, change
};