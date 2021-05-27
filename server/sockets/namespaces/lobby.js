import { socketIsLoggedIn } from '../../middleware/authentication';
// import { sendSocketError } from '../utils';

export default function (io, server) {
	const lobby = io.of('/lobby');

	lobby.use(socketIsLoggedIn(server));

	lobby.on('connection', (socket) => {
		console.log('--- user connected to lobby');

		socket.on('challengePlayer', (id) => {
			const targetUser = lobby.getConnectedUsers().find((user) => {
				return user.id === id;
			});

			//send the challenge to the target user
			if (targetUser) {
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
