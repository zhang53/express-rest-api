const express = require('express');
const cors = require('cors');
const app = express();

const config = require('./config/app');
require('datejs');
require('./config/db');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require(`./swagger/${config.nodeEnv}.json`);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    explorer: true
}));

app.use(cors());
const api = require('./routes/api');
app.use('/api', api);

module.exports = app;