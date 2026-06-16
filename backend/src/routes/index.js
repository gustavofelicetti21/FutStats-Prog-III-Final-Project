const { Router } = require('express');

const authRoutes = require('./authRoutes');
const healthRoutes = require('./healthRoutes');

const routes = Router();

routes.use(authRoutes);
routes.use(healthRoutes);

module.exports = routes;
