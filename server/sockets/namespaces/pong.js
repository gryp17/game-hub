import { socketIsLoggedIn } from '../../middleware/authentication';
import { User, Game } from '../../models';
import Pong from '../../game-servers/pong';

export default function (io, app) {
	const pong = io.of('/pong');
	const lobby = io.of('/lobby');

	const games = {};

	const fps = 60; // TODO: need to get the FPS and the width and height from a config or something
	const canvas = {
		width: 1000,
		height: 620
	};
	const maxPlayers = 2;

	pong.use(socketIsLoggedIn(app));

	pong.on('connection', async (socket) => {
		lobby.setUserStatus(socket.user.id, 'pong');

		const gameInstance = await pong.getPendingGame(socket.user.id);

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
		if (playersCount === maxPlayers) {
			gameInstance.update({
				status: 'in-progress'
			});

			const players = [...roomClients];
			const gameId = gameInstance.id;

			const game = new Pong(gameId, fps, canvas, players, {
				onUpdate(data) {
					pong.to(gameRoomId).emit('updateData', data);
				}
			});

			game.start();

			games[gameId] = game;

			//start the game sending a separate event to each player
			players.forEach((socketId, index) => {
				pong.to(socketId).emit('startGame', {
					fps,
					canvas,
					player: index + 1
				});
			});
		}

		socket.on('updateInputs', (inputs) => {
			//find the game that this player belongs to and update it's inputs
			const game = pong.getGameByPlayer(socket.id);
			game.updateInputs({ socketId: socket.id, inputs });
		});

		//disconnect event handler
		socket.on('disconnect', () => {
			//update the user status
			lobby.setUserStatus(socket.user.id, 'offline');

			if (gameInstance) {
				gameInstance.update({
					status: 'finished'
				});

				pong.stopGame(gameInstance.id);
			}
		});
	});

	pong.getPendingGame = async (userId) => {
		const userInstance = await User.findByPk(userId, {
			include: {
				model: Game,
				required: false,
				where: {
					type: 'pong',
					status: 'pending'
				}
			}
		});

		const pendingGames = userInstance.games;

		if (!pendingGames || pendingGames.length === 0) {
			return null;
		}

		return pendingGames.pop();
	};

	pong.getGameByPlayer = (socketId) => {
		const game = Object.values(games).find((game) => {
			return game.playerBelongsToGame(socketId);
		});

		return game;
	};

	pong.stopGame = (gameId) => {
		const game = games[gameId];

		if (game) {
			game.stop();
			delete games[gameId];
		}

		pong.to(gameId).emit('exitGame');
	};

	return pong;
}
