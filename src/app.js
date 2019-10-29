const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const error = require('./middlewares/error.middleware');
const swaggerDocument = YAML.load(path.join(__dirname, '../docs/swagger.yml'));

// Define app settings
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Import routes modules
const home = require('./routes/home.route');
const pullRequests = require('./routes/pull-request.route');
const repos = require('./routes/repository.route');
const workitems = require('./routes/work-items.route');

// Define routes for api v1
app.use('/api/v1', home);
app.use('/api/v1/pullrequests', pullRequests);
app.use('/api/v1/repos', repos);
app.use('/api/v1/workitems', workitems);

// Define routes for documentation api
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Define middlewares
app.use(error.notFound);
app.use(error.serverError);

module.exports = app;
