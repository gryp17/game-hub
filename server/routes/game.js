import express from 'express';
import { isLoggedIn } from '../middleware/authentication';
import { validate } from '../middleware/validator';
import { User } from '../models';
import { sendResponse, sendApiError, sendError } from '../services/utils';
import { errorCodes, gameStatuses } from '../config';

const router = express.Router();

const rules = {
	getGames: {
		limit: ['required', 'integer'],
		offset: ['required', 'integer']
	}
};

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

		let finishedGames = await userInstance.getGames({
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
		finishedGames = finishedGames.map((item) => {
			const game = item.toJSON();

			//need to manually parse the game data attribute because sequelize is shit
			try {
				game.data = JSON.parse(game.data);
			} catch (e) {
				game.data = {};
			}

			delete game.game_user;

			game.users = game.users.map((user) => {
				return user.id;
			});

			return game;
		});

		sendResponse(res, {
			total: total.length,
			games: finishedGames
		});
	} catch (err) {
		sendApiError(res, err);
	}
});

export default router;
