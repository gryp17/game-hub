import express from 'express';
import { isLoggedIn } from '../middleware/authentication';
import { validate } from '../middleware/validator';
import { sendResponse, sendError } from '../services/utils';
import { lobby } from '../sockets';
import { errorCodes, userStatuses, availableGames } from '../config';
import { Game } from '../models';
import cache from '../services/cache';

const router = express.Router();

const gameCodes = Object.values(availableGames).join(',');

const rules = {
	challengePlayer: {
		userId: ['integer'],
		game: [`in(${gameCodes})`]
	},
	cancelChallenge: {
		userId: ['integer']
	},
	declineChallenge: {
		userId: ['integer']
	},
	acceptChallenge: {
		userId: ['integer']
	}
};

//challenge player
router.post('/challenge', isLoggedIn, validate(rules.challengePlayer), (req, res) => {
	const { userId, game } = req.body;

	const challengedUser = lobby.getUserById(userId);
	const ownUser = lobby.getUserById(req.session.user.id);

	if (!challengedUser) {
		return sendError(res, {
			userId: errorCodes.INVALID_USER_ID
		});
	}

	//add the pending challenge entry
	cache.addPendingChallenge({
		id: ownUser.id,
		socketId: ownUser.socketId
	}, {
		id: challengedUser.id,
		socketId: challengedUser.socketId
	}, game);

	//send the socketio event to the challenged player
	lobby.challengePlayer(challengedUser, ownUser, game);

	//set both users status to busy while the challenge is still active
	lobby.setUserStatus(ownUser.id, userStatuses.BUSY);
	lobby.setUserStatus(challengedUser.id, userStatuses.BUSY);

	sendResponse(res, true);
});

//cancel challenge
router.delete('/challenge', isLoggedIn, validate(rules.cancelChallenge), (req, res) => {
	const { userId } = req.body;

	const challengedUser = lobby.getUserById(userId);
	const ownUser = lobby.getUserById(req.session.user.id);

	if (!challengedUser) {
		return sendError(res, {
			userId: errorCodes.INVALID_USER_ID
		});
	}

	cache.deletePendingChallenge(ownUser.id);

	//send the socketio event to cancel the challenge
	lobby.cancelChallenge(challengedUser);

	lobby.setUserStatus(ownUser.id, userStatuses.ONLINE);
	lobby.setUserStatus(challengedUser.id, userStatuses.ONLINE);

	sendResponse(res, true);
});

//decline challenge
router.post('/challenge/decline', isLoggedIn, validate(rules.declineChallenge), (req, res) => {
	const { userId } = req.body;

	const challenger = lobby.getUserById(userId);
	const ownUser = lobby.getUserById(req.session.user.id);

	if (!challenger) {
		return sendError(res, {
			userId: errorCodes.INVALID_USER_ID
		});
	}

	cache.deletePendingChallenge(ownUser.id);

	//send the socketio event to decline the challenge
	lobby.declineChallenge(challenger);

	lobby.setUserStatus(ownUser.id, userStatuses.ONLINE);
	lobby.setUserStatus(challenger.id, userStatuses.ONLINE);

	sendResponse(res, true);
});

//accept challenge
router.post('/challenge/accept', isLoggedIn, validate(rules.acceptChallenge), async (req, res) => {
	const { userId } = req.body;

	const challenger = lobby.getUserById(userId);
	const ownUser = lobby.getUserById(req.session.user.id);
	const challenge = cache.getPendingChallenge(ownUser.id);

	if (!challenger) {
		return sendError(res, {
			userId: errorCodes.INVALID_USER_ID
		});
	}

	if (!challenge) {
		return sendError(res, {
			userId: errorCodes.CHALLENGE_NOT_FOUND
		});
	}

	const gameType = challenge.game;

	//create the game with both users
	const gameInstance = await Game.create({
		type: gameType,
		status: 'pending'
	});

	await gameInstance.setUsers([
		challenger.id,
		ownUser.id
	]);

	cache.deletePendingChallenge(ownUser.id);

	//send the go to game event to both players
	lobby.goToGame([
		challenger,
		ownUser
	], gameType);

	sendResponse(res, {
		game: gameInstance.toJSON()
	});
});

export default router;