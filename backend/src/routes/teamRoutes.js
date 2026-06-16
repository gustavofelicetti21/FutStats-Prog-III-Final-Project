const { Router } = require('express');

const TeamController = require('../controllers/TeamController');
const authMiddleware = require('../middlewares/authMiddleware');

const teamRoutes = Router();

teamRoutes.get('/teams', TeamController.index);
teamRoutes.get('/teams/:id', TeamController.show);

teamRoutes.post('/teams', authMiddleware, TeamController.create);
teamRoutes.put('/teams/:id', authMiddleware, TeamController.update);
teamRoutes.delete('/teams/:id', authMiddleware, TeamController.delete);
teamRoutes.patch('/teams/:id/deactivate', authMiddleware, TeamController.deactivate);

module.exports = teamRoutes;
