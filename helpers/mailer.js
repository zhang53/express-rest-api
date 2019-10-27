const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const config = require('../config/app');

const transport = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure,
    // debug: true,
    auth: {
        user: config.smtp.username,
        pass: config.smtp.password
    }
});

function viewOption(transport, hbs) {
    transport.use('compile', hbs({
        viewEngine: {
            extName: '.hbs',
            partialsDir: 'views/partial',
            layoutsDir: '',
            defaultLayout: '',
        },
        viewPath: 'views/email',
        extName: '.hbs'
    }));
}

async function sendMail(to, subject, template, context, from = config.smtp.from) {
    viewOption(transport, hbs);
    context.appName = config.appName;

    try {
        await transport.verify();
        await transport.sendMail({ from, to, subject, template, context });
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    transport, viewOption, sendMail
}