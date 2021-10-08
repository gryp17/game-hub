import express from 'express';
import { isLoggedIn } from '../middleware/authentication';
import { validate } from '../middleware/validator';
import { sendResponse, sendError } from '../services/utils';
import matchmaking from '../services/matchmaking';
import { lobby } from '../sockets';
import { errorCodes, userStatuses, gameStatuses, gameModes, gameCodes } from '../config';
import { Game, User } from '../models';
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

/**
 * Returns the current user matchmaking status
 */
router.get('/status', isLoggedIn, (req, res) => {
	const status = matchmaking.hasJoinedMatchmaking(req.session.user.id);
	sendResponse(res, status);
});

/**
 * Joins the matchmaking
 */
router.post('/join', isLoggedIn, validate(rules.joinMatchmaking), async (req, res) => {
	const { game } = req.body;

	//get the user socket id from the lobby
	const user = lobby.getUserById(req.session.user.id);

	lobby.setUserStatus(req.session.user.id, userStatuses.matchmaking);

	//get the current experience value
	const userInstance = await User.findByPk(req.session.user.id);

	matchmaking.join(req.session.user.id, user.socketId, userInstance.experience, game);
	sendResponse(res, true);
});

/**
 * Leaves the matchmaking
 */
router.post('/leave', isLoggedIn, (req, res) => {
	lobby.setUserStatus(req.session.user.id, userStatuses.online);

	matchmaking.leave(req.session.user.id);
	sendResponse(res, true);
});

/**
 * Cancels the matchmaking challenge
 */
router.delete('/challenge', isLoggedIn, (req, res) => {
	lobby.cancelPendingMatchmakingChallenges(req.session.user.id);

	sendResponse(res, true);
});

/**
 * Accepts the matchmaking challenge
 */
router.post('/challenge/accept', isLoggedIn, async (req, res) => {
	const user = req.session.user;

	cache.updateMatchmakingChallenge(user.id, true);

	const challenge = cache.getMatchmakingChallenge(user.id);

	if (!challenge) {
		return sendError(res, {
			userId: errorCodes.challengeNotFound
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
			mode: gameModes.matchmaking,
			status: gameStatuses.pending
		});

		await gameInstance.setUsers(Object.keys(challenge.players));

		//send the go to game event to both players
		lobby.goToGame(Object.values(challenge.players), gameType);
	}

	sendResponse(res, true);
});

export default router;
