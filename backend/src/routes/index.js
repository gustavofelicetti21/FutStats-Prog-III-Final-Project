const { Router } = require('express');

const authRoutes = require('./authRoutes');
const healthRoutes = require('./healthRoutes');
const teamRoutes = require('./teamRoutes');

const routes = Router();

routes.use(authRoutes);
routes.use(healthRoutes);
routes.use(teamRoutes);

module.exports = routes;
