import { Router } from 'express';

import gameController from '../controllers/game.js';
import { isConnectedToSocket, isGameOwner, isInGame, isInProgressGame, isLogged, isNotInGame, isPlayerTurn } from '../middleware.js';
// import io from '../index.js';

const router = Router();

router.get('/game-running', isLogged, gameController.getGameRunningByUserId);
router.get('/history', isLogged, gameController.getHistory);
router.post('/', isLogged, isNotInGame, gameController.post);
router.post('/leave', isLogged, isConnectedToSocket, isInGame, gameController.leave);
router.post('/join', isLogged, isConnectedToSocket, isNotInGame, gameController.join);
router.post('/start', isLogged, isConnectedToSocket, isInGame, isGameOwner, gameController.start);
router.post('/end-turn', isLogged, isConnectedToSocket, isInProgressGame, gameController.endTurn);
router.get('/hand', isLogged, isConnectedToSocket, isInProgressGame, gameController.getHand);
router.get('/opponent-hand', isLogged, isConnectedToSocket, isInProgressGame, gameController.countOpponentCards);
router.delete('/', isLogged, isConnectedToSocket, isInGame, isGameOwner, gameController.delete);
router.get('/:id', isLogged, isConnectedToSocket, isInGame, gameController.get);

// Place card on board
router.post('/board/card', isLogged, isConnectedToSocket, isInProgressGame, isPlayerTurn, gameController.placeCard);

// attack
router.route('/attack' );
router.post('/attack/player', isLogged, isConnectedToSocket, isInProgressGame, isPlayerTurn, gameController.attackPlayer);
router.post('/attack/card', isLogged, isConnectedToSocket, isInProgressGame, isPlayerTurn, gameController.attackCard);

export default router;
