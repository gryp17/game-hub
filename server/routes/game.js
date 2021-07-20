import express from 'express';
import { isLoggedIn } from '../middleware/authentication';
import { validate } from '../middleware/validator';
import { User } from '../models';
import { sendResponse, sendApiError, sendError } from '../services/utils';
import { errorCodes, gameStatuses } from '../config';

const router = express.Router();

const rules = {
	getGames: {
		limit: ['required', 'number'],
		offset: ['required', 'number']
	}
};

router.get('/stats/:userId', isLoggedIn, async (req, res) => {
	try {
		const userId = parseInt(req.params.userId);
		const userInstance = await User.findByPk(userId);

		if (!userInstance) {
			return sendError(res, {
				userId: errorCodes.INVALID_USER_ID
			});
		}

		const games = await userInstance.getGames();

		const total = games.length;
		let won = 0;
		let lost = 0;
		let ragequit = 0;

		games.forEach((game) => {
			if (game.winner === userId) {
				won++;
			} else {
				if (game.ragequit) {
					ragequit++;
				}

				lost++;
			}
		});

		sendResponse(res, {
			total,
			won,
			lost,
			ragequit
		});
	} catch (err) {
		sendApiError(res, err);
	}
});

router.get('/history/:userId', isLoggedIn, validate(rules.getGames), async (req, res) => {
	const maxGamesPerRequest = 20;

	try {
		const userId = parseInt(req.params.userId);
		let limit = parseInt(req.query.limit);
		const offset = parseInt(req.query.offset);

		limit = limit > maxGamesPerRequest ? maxGamesPerRequest : limit;

		const userInstance = await User.findByPk(userId);

		if (!userInstance) {
			return sendError(res, {
				userId: errorCodes.INVALID_USER_ID
			});
		}

		const total = await userInstance.getGames({
			where: {
				status: gameStatuses.FINISHED
			}
		});

		let games = await userInstance.getGames({
			where: {
				status: gameStatuses.FINISHED
			},
			limit,
			offset,
			order: [
				['updatedAt', 'desc']
			],
			include: [
				{
					model: User,
					attributes: [
						'id'
					]
				}
			]
		});

		//return only the necessary data
		games = games.map((item) => {
			const game = item.toJSON();

			delete game.game_user;

			game.users = game.users.map((user) => {
				return user.id;
			});

			return game;
		});

		sendResponse(res, {
			total: total.length,
			games
		});
	} catch (err) {
		sendApiError(res, err);
	}
});

export default router;
