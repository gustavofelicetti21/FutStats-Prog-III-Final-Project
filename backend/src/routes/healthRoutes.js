const { Router } = require('express');

const HealthController = require('../controllers/HealthController');

const healthRoutes = Router();

healthRoutes.get('/health', HealthController.check);

module.exports = healthRoutes;
