const { Router } = require('express');

const MatchController = require('../controllers/MatchController');
const authMiddleware = require('../middlewares/authMiddleware');

const matchRoutes = Router();

matchRoutes.get('/matches', MatchController.index);
matchRoutes.get('/matches/championship/:championshipId', MatchController.byChampionship);
matchRoutes.get('/matches/round/:roundId', MatchController.byRound);
matchRoutes.get('/matches/:id', MatchController.show);

matchRoutes.patch('/matches/:id/result', authMiddleware, MatchController.updateResult);
matchRoutes.delete('/matches/:id', authMiddleware, MatchController.delete);

module.exports = matchRoutes;
