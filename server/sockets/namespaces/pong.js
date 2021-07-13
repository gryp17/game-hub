import { socketIsLoggedIn } from '../../middleware/authentication';
import { userStatuses, gameStatuses, games } from '../../config';
import { User, Game } from '../../models';
import { lobby } from '..';
import cache from '../../services/cache';
import Pong from '../../../games/pong/entry-points/server';

export default function (io, app) {
	const pong = io.of('/pong');

	pong.use(socketIsLoggedIn(app));

	pong.on('connection', async (socket) => {
		lobby.setUserStatus(socket.user.id, userStatuses.PONG);

		let gameInstance = await pong.getPendingGame(socket.user.id);

		if (!gameInstance) {
			return pong.to(socket.id).emit('exitGame');
		}

		const gameRoomId = gameInstance.id;

		//join the game room
		socket.join(gameRoomId);

		//get the number of connected players in the game room
		const roomClients = pong.adapter.rooms.get(gameRoomId);
		const playersCount = roomClients ? roomClients.size : 0;

		//once both players have joined the room - mark it as in progress
		if (playersCount === games.PONG.maxPlayers) {
			gameInstance.update({
				status: gameStatuses.IN_PROGRESS
			});

			const players = [...roomClients].map((socketId) => {
				return pong.getUserBySocketId(socketId);
			});

			const gameId = gameInstance.id;

			const game = new Pong(gameId, games.PONG, players, {
				onUpdate(data) {
					pong.to(gameRoomId).emit('updateData', data);
				},
				onGameOver(winner) {
					pong.to(gameRoomId).emit('gameOver', winner.id);

					cache.deleteGameState(gameId);

					gameInstance.update({
						status: gameStatuses.FINISHED,
						winner: winner.id
					});
				}
			});

			game.start();

			cache.addGameState(gameId, game);

			//start the game sending a separate event to each player
			players.forEach((player, index) => {
				pong.to(player.socketId).emit('startGame', {
					config: games.PONG,
					player: index + 1
				});
			});
		}

		socket.on('updateInputs', (inputs) => {
			//find the game that this player belongs to and update it's inputs
			const game = cache.findGameStateByUserId(socket.user.id);
			game.updateInputs({ socketId: socket.id, inputs });
		});

		//disconnect event handler
		socket.on('disconnect', async () => {
			//update the user status
			lobby.setUserStatus(socket.user.id, userStatuses.OFFLINE);

			//reload the game instance manually (reload() fails for some reason)
			gameInstance = await Game.findByPk(gameInstance.id);

			//set the other user as winner if the game hasn't been finished yet
			if (gameInstance && gameInstance.status !== gameStatuses.FINISHED) {
				const game = cache.findGameStateById(gameInstance.id);

				//find the other/remaining user
				const winner = game.players.find((user) => {
					return user.id !== socket.user.id;
				});

				game.gameIsOver(winner);
			}
		});
	});

	/**
	 * Helper function that returns an array of all connected users
	 * @returns {Array}
	 */
	pong.getConnectedUsers = () => {
		const users = [];

		pong.sockets.forEach((data) => {
			users.push({
				...data.user,
				socketId: data.id
			});
		});

		return users;
	};

	/**
	 * Returns the user object that matches the provided socketId
	 * @param {Number} userId
	 * @returns {Object}
	 */
	pong.getUserBySocketId = (socketId) => {
		const connectedUsers = pong.getConnectedUsers();
		return connectedUsers.find((user) => {
			return user.socketId === socketId;
		});
	};

	pong.getPendingGame = async (userId) => {
		const userInstance = await User.findByPk(userId, {
			include: {
				model: Game,
				required: false,
				where: {
					type: games.PONG.code,
					status: gameStatuses.PENDING
				}
			}
		});

		const pendingGames = userInstance.games;

		if (!pendingGames || pendingGames.length === 0) {
			return null;
		}

		return pendingGames.pop();
	};

	return pong;
}
