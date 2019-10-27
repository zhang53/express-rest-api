const seeder = require('mongoose-seed');

const config = require('./config/app');
const data = require('./config/seedData');

seeder.connect(config.dbUrl, function () {
    seeder.loadModels([
        './models/User.js'
    ]);

    seeder.clearModels(['user'], function () {
        seeder.populateModels(data, function () {
            seeder.disconnect();
        });
    });
});