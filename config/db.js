const config = require('./app');

const mongoose = require('mongoose');
mongoose.connect(config.dbUrl, {
    useNewUrlParser: true
});