import express from 'express';
import { isLoggedIn } from '../middleware/authentication';
import { validate } from '../middleware/validator';
import { sendResponse, sendError } from '../services/utils';
import { lobby } from '../sockets';
import { errorCodes, userStatuses, gameStatuses, gameModes, games, gameCodes } from '../config';
import { Game, User } from '../models';
import cache from '../services/cache';

const router = express.Router();

const validGameCodes = gameCodes.join(',');

const rules = {
	challengePlayer: {
		userId: ['integer'],
		game: [`in(${validGameCodes})`]
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

function validateGameSettings(game, settings) {
	if (game === games.pong.code) {
		const validSettings = {};

		//check if every setting key is set and it's value is valid
		Object.keys(games.pong.configurableSettings).forEach((settingType) => {
			let value = settings ? settings[settingType] : null;
			const validValuesMap = games.pong.configurableSettings[settingType];
			const validKeys = Object.keys(validValuesMap);

			//if the value is not set or is not valid fallback to the default/normal value
			if (!value || !validKeys.includes(value)) {
				value = validValuesMap.normal;
			}

			validSettings[settingType] = value;
		});

		return validSettings;
	}

	//TODO: add more game types if necessary

	return {};
}

//challenge player
router.post('/challenge', isLoggedIn, validate(rules.challengePlayer), (req, res) => {
	const { userId, game, settings } = req.body;

	const gameSettings = validateGameSettings(game, settings);

	const challengedUser = lobby.getUserById(userId);
	const ownUser = lobby.getUserById(req.session.user.id);

	if (!challengedUser) {
		return sendError(res, {
			userId: errorCodes.invalidUserId
		});
	}

	//add the pending challenge entry
	cache.addPendingChallenge({
		id: ownUser.id,
		socketId: ownUser.socketId
	}, {
		id: challengedUser.id,
		socketId: challengedUser.socketId
	}, game, gameSettings);

	//send the socketio event to the challenged player
	lobby.challengePlayer(challengedUser, ownUser, game, gameSettings);

	//set both users status to busy while the challenge is still active
	lobby.setUserStatus(ownUser.id, userStatuses.busy);
	lobby.setUserStatus(challengedUser.id, userStatuses.busy);

	sendResponse(res, true);
});

//cancel challenge
router.delete('/challenge', isLoggedIn, validate(rules.cancelChallenge), (req, res) => {
	const { userId } = req.body;

	const challengedUser = lobby.getUserById(userId);
	const ownUser = lobby.getUserById(req.session.user.id);

	if (!challengedUser) {
		return sendError(res, {
			userId: errorCodes.invalidUserId
		});
	}

	cache.deletePendingChallenge(ownUser.id);

	//send the socketio event to cancel the challenge
	lobby.cancelChallenge(challengedUser);

	lobby.setUserStatus(ownUser.id, userStatuses.online);
	lobby.setUserStatus(challengedUser.id, userStatuses.online);

	sendResponse(res, true);
});

//decline challenge
router.post('/challenge/decline', isLoggedIn, validate(rules.declineChallenge), (req, res) => {
	const { userId } = req.body;

	const challenger = lobby.getUserById(userId);
	const ownUser = lobby.getUserById(req.session.user.id);

	if (!challenger) {
		return sendError(res, {
			userId: errorCodes.invalidUserId
		});
	}

	cache.deletePendingChallenge(ownUser.id);

	//send the socketio event to decline the challenge
	lobby.declineChallenge(challenger);

	lobby.setUserStatus(ownUser.id, userStatuses.online);
	lobby.setUserStatus(challenger.id, userStatuses.online);

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
			userId: errorCodes.invalidUserId
		});
	}

	if (!challenge) {
		return sendError(res, {
			userId: errorCodes.challengeNotFound
		});
	}

	const gameType = challenge.game;
	const userIds = [
		challenger.id,
		ownUser.id
	];

	//do some clean up by finding any pending/in progress games related to any of the 2 users and deleting them before creating a new one
	const pendingGames = await Game.findAll({
		where: {
			status: [gameStatuses.pending, gameStatuses.inProgress]
		},
		include: {
			model: User,
			required: true,
			where: {
				id: userIds
			}
		}
	});

	if (pendingGames.length > 0) {
		const gameIds = pendingGames.map((game) => {
			return game.id;
		});

		await Game.destroy({
			where: {
				id: gameIds
			}
		});
	}

	//create the game with both users
	const gameInstance = await Game.create({
		type: gameType,
		mode: gameModes.challenge,
		status: gameStatuses.pending,
		settings: challenge.settings
	});

	await gameInstance.setUsers(userIds);

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
