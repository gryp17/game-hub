import { socketIsLoggedIn } from '../../middleware/authentication';
import { sendSocketError } from '../../utils';
import { User } from '../../models';

export default function (io, server) {
	const pong = io.of('/pong');

	pong.use(socketIsLoggedIn(server));

	pong.on('connection', async (socket) => {
		console.log('--- user connected to pong');

		const userInstance = await User.findByPk(socket.user.id);
		const pendingGames = await userInstance.getGames({
			where: {
				type: 'pong',
				status: 'pending'
			}
		});

		if (!pendingGames || pendingGames.length === 0) {
			// maybe send a message to make the user go back to the lobby instead?
			return sendSocketError(pong, 'The game doesnt exist');
		}

		const gameInstance = pendingGames.pop();
		const gameRoomId = gameInstance.id;

		//join the game room
		socket.join(gameRoomId);
		pong.to(gameRoomId).emit('gameMessage', 'it works');

		//get the number of connected players in the game room
		const roomClients = pong.adapter.rooms.get(gameRoomId);
		const playersCount = roomClients ? roomClients.size : 0;

		//once both players have joined the room - mark it as in progress
		if (playersCount === 2) {
			gameInstance.update({
				status: 'in-progress'
			});

			//TODO: start the actual game
		}

		//disconnect event handler
		socket.on('disconnect', () => {
			console.log('--- user disconnected from pong');

			if (gameInstance) {
				gameInstance.update({
					status: 'finished'
				});

				//TODO: send a redirect message to the other user?
			}
		});
	});

	return pong;
}
