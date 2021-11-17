import { socketIsLoggedIn } from '../../middleware/authentication';
import { userStatuses, gameStatuses, games, socketEvents } from '../../config';
import { User, Game } from '../../models';
import { lobby } from '..';
import cache from '../../services/cache';
import Pong from '../../../games/pong/entry-points/server';
import Volley from '../../../games/volley/entry-points/server';
import Jumper from '../../../games/jumper/entry-points/server';

const gameClasses = {
	pong: Pong,
	volley: Volley,
	jumper: Jumper
};

export default function (io, app) {
	const ns = io.of('/game');
	let gameType;

	ns.use(socketIsLoggedIn(app));

	ns.on(socketEvents.connection, async (socket) => {
		let gameInstance = await ns.getPendingGame(socket.user.id);

		if (!gameInstance) {
			return ns.to(socket.id).emit(socketEvents.game.exitGame);
		}

		gameType = gameInstance.type;

		lobby.setUserStatus(socket.user.id, userStatuses[gameType]);

		const gameRoomId = gameInstance.id;
		const gameConfig = games[gameType];
		const GameClass = gameClasses[gameType];

		//join the game room
		socket.join(gameRoomId);

		//get the number of connected players in the game room
		const roomClients = ns.adapter.rooms.get(gameRoomId);
		const playersCount = roomClients ? roomClients.size : 0;

		//once both players have joined the room - mark it as in progress
		if (playersCount === gameConfig.maxPlayers) {
			gameInstance.update({
				status: gameStatuses.inProgress
			});

			const players = [...roomClients].map((socketId) => {
				return ns.getUserBySocketId(socketId);
			});

			const gameId = gameInstance.id;

			const customSettings = gameInstance.settings;

			const game = new GameClass(gameId, gameConfig, customSettings, players, {
				onUpdate(data) {
					ns.to(gameRoomId).emit(socketEvents.game.updateData, data);
				},
				async onGameOver(winner, scores, ragequit) {
					cache.deleteGameState(gameId);

					await gameInstance.update({
						status: gameStatuses.finished,
						winner: winner.id,
						ragequit,
						result: scores
					});

					ns.to(gameRoomId).emit(socketEvents.game.gameOver, {
						winner: winner.id,
						ragequit,
						score: scores
					});

					lobby.updateGameStats(players);
					lobby.updateUsersExperience(winner.id, players);
				}
			});

			game.start();

			cache.addGameState(gameId, game);

			//start the game sending a separate event to each player
			players.forEach((player, index) => {
				ns.to(player.socketId).emit(socketEvents.game.startGame, {
					canvasIds: game.canvasIds,
					config: game.config,
					player: index + 1
				});
			});
		}

		socket.on(socketEvents.game.updateInputs, (inputs) => {
			//find the game that this player belongs to and update it's inputs
			const game = cache.findGameStateByUserId(socket.user.id);

			if (game) {
				game.updateInputs({ socketId: socket.id, inputs });
			}
		});

		//disconnect event handler
		socket.on(socketEvents.disconnect, async () => {
			//update the user status
			lobby.setUserStatus(socket.user.id, userStatuses.offline);

			//reload the game instance manually (reload() fails for some reason)
			gameInstance = await Game.findByPk(gameInstance.id);

			//set the other user as winner if the game hasn't been finished yet
			if (gameInstance && gameInstance.status !== gameStatuses.finished) {
				const game = cache.findGameStateById(gameInstance.id);

				//find the other/remaining user
				const winner = game.players.find((user) => {
					return user.id !== socket.user.id;
				});

				game.gameIsOver(winner, true);
			}
		});
	});

	/**
	 * Helper function that returns an array of all connected users
	 * @returns {Array}
	 */
	ns.getConnectedUsers = () => {
		const users = [];

		ns.sockets.forEach((data) => {
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
	ns.getUserBySocketId = (socketId) => {
		const connectedUsers = ns.getConnectedUsers();
		return connectedUsers.find((user) => {
			return user.socketId === socketId;
		});
	};

	/**
	 * Finds the pending game record that the provided user belongs to
	 * @param {Number} userId
	 * @returns {Object}
	 */
	ns.getPendingGame = async (userId) => {
		const userInstance = await User.findByPk(userId, {
			include: {
				model: Game,
				required: false,
				where: {
					status: gameStatuses.pending
				}
			}
		});

		const pendingGames = userInstance.games;

		if (!pendingGames || pendingGames.length === 0) {
			return null;
		}

		return pendingGames.pop();
	};

	return ns;
}
