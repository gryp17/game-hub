import express from 'express';
import { isLoggedIn } from '../middleware/authentication';
import { validate } from '../middleware/validator';
import { sendResponse, sendError } from '../services/utils';
import matchmaking from '../services/matchmaking';
import { lobby } from '../sockets';
import { errorCodes, userStatuses, gameCodes } from '../config';
import { Game } from '../models';
import cache from '../services/cache';

const router = express.Router();

const validGameCodes = [
	'any',
	...gameCodes
].join(',');

const rules = {
	joinMatchmaking: {
		game: [`in(${validGameCodes})`]
	}
};

router.get('/status', isLoggedIn, (req, res) => {
	const status = matchmaking.hasJoinedMatchmaking(req.session.user.id);
	sendResponse(res, status);
});

router.post('/join', isLoggedIn, validate(rules.joinMatchmaking), (req, res) => {
	const { game } = req.body;

	//get the user socket id from the lobby
	const user = lobby.getUserById(req.session.user.id);

	lobby.setUserStatus(req.session.user.id, userStatuses.MATCHMAKING);

	matchmaking.join(req.session.user.id, user.socketId, game);
	sendResponse(res, true);
});

router.post('/leave', isLoggedIn, (req, res) => {
	lobby.setUserStatus(req.session.user.id, userStatuses.ONLINE);

	matchmaking.leave(req.session.user.id);
	sendResponse(res, true);
});

//cancel matchmaking challenge
router.delete('/challenge', isLoggedIn, (req, res) => {
	lobby.cancelPendingMatchmakingChallenges(req.session.user.id);

	sendResponse(res, true);
});

//accept matchmaking challenge
router.post('/challenge/accept', isLoggedIn, async (req, res) => {
	const user = req.session.user;

	cache.updateMatchmakingChallenge(user.id, true);

	const challenge = cache.getMatchmakingChallenge(user.id);

	if (!challenge) {
		return sendError(res, {
			userId: errorCodes.CHALLENGE_NOT_FOUND
		});
	}

	//check if both players have accepted the matchmaking challenge
	const ready = Object.values(challenge.players).every((user) => {
		return user.accepted;
	});

	if (ready) {
		cache.deleteMatchmakingChallenge(user.id);

		const gameType = challenge.game;

		//create the game with both users
		const gameInstance = await Game.create({
			type: gameType,
			status: 'pending'
		});

		await gameInstance.setUsers(Object.keys(challenge.players));

		//send the go to game event to both players
		lobby.goToGame(Object.values(challenge.players), gameType);
	}

	sendResponse(res, true);
});

export default router;
