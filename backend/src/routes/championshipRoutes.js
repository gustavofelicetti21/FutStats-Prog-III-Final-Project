const { Router } = require('express');

const ChampionshipController = require('../controllers/ChampionshipController');
const authMiddleware = require('../middlewares/authMiddleware');

const championshipRoutes = Router();

championshipRoutes.get('/championships', ChampionshipController.index);
championshipRoutes.get('/championships/:id', ChampionshipController.show);

championshipRoutes.post('/championships', authMiddleware, ChampionshipController.create);
championshipRoutes.post('/championships/:id/teams', authMiddleware, ChampionshipController.addTeam);
championshipRoutes.put('/championships/:id', authMiddleware, ChampionshipController.update);
championshipRoutes.delete('/championships/:id', authMiddleware, ChampionshipController.delete);
championshipRoutes.delete(
  '/championships/:id/teams/:teamId',
  authMiddleware,
  ChampionshipController.removeTeam,
);
championshipRoutes.patch(
  '/championships/:id/deactivate',
  authMiddleware,
  ChampionshipController.deactivate,
);

module.exports = championshipRoutes;
