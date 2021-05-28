import { socketIsLoggedIn } from '../../middleware/authentication';
// import { sendSocketError } from '../../utils';
import { Game } from '../../models';

export default function (io, server) {
	const lobby = io.of('/lobby');

	lobby.use(socketIsLoggedIn(server));

	lobby.on('connection', (socket) => {
		console.log('--- user connected to lobby');

		socket.on('challengePlayer', async (id) => {
			const targetUser = lobby.getConnectedUsers().find((user) => {
				return user.id === id;
			});

			//send the challenge to the target user
			if (targetUser) {
				// TODO: do this only if both players have accepted the challenge
				//create a pending game waiting for both players to join
				const gameInstance = await Game.create({
					type: 'pong',
					status: 'pending'
				});

				await gameInstance.setUsers([
					socket.user.id,
					targetUser.id
				]);

				lobby.to(targetUser.socketId).emit('challengeReceived', socket.user);
			}
		});

		//disconnect event handler
		socket.on('disconnect', () => {
			console.log('--- user disconnected from lobby');
		});
	});

	/**
	 * Helper function that returns an array of all connected users
	 * @returns {Array}
	 */
	lobby.getConnectedUsers = () => {
		const users = [];

		lobby.sockets.forEach((data) => {
			users.push({
				...data.user,
				socketId: data.id
			});
		});

		return users;
	};

	return lobby;
}
