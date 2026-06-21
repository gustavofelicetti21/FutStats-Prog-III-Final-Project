const { Router } = require('express');

const authRoutes = require('./authRoutes');
const championshipRoutes = require('./championshipRoutes');
const healthRoutes = require('./healthRoutes');
const matchRoutes = require('./matchRoutes');
const teamRoutes = require('./teamRoutes');

const routes = Router();

routes.use(authRoutes);
routes.use(championshipRoutes);
routes.use(healthRoutes);
routes.use(matchRoutes);
routes.use(teamRoutes);

module.exports = routes;
