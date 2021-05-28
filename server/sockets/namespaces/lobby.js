import { socketIsLoggedIn } from '../../middleware/authentication';
// import { sendSocketError } from '../../utils';
import { Game } from '../../models';

export default function (io, server) {
	const lobby = io.of('/lobby');

	lobby.use(socketIsLoggedIn(server));

	lobby.on('connection', (socket) => {
		console.log('--- user connected to lobby');

		socket.on('challengePlayer', async (challengedUserId) => {
			const challengedUser = lobby.getUserById(challengedUserId);

			//send the challenge to the target user
			if (challengedUser) {
				lobby.to(challengedUser.socketId).emit('challenge', socket.user);
			}
		});

		socket.on('cancelChallenge', (challengedUserId) => {
			const challengedUser = lobby.getUserById(challengedUserId);

			if (challengedUser) {
				lobby.to(challengedUser.socketId).emit('cancelChallenge');
			}
		});

		socket.on('declineChallenge', (challengerId) => {
			const challenger = lobby.getUserById(challengerId);

			if (challenger) {
				lobby.to(challenger.socketId).emit('declineChallenge');
			}
		});

		socket.on('acceptChallenge', async (challengerId) => {
			const challenger = lobby.getUserById(challengerId);

			if (challenger) {
				//create the game with both users
				const gameInstance = await Game.create({
					type: 'pong',
					status: 'pending'
				});

				await gameInstance.setUsers([
					challenger.id,
					socket.user.id
				]);

				//send the go to game event to both players
				lobby.to(challenger.socketId).emit('goToGame');
				lobby.to(socket.id).emit('goToGame');
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

	/**
	 * Returns the user object that matches the provided userId
	 * @param {Number} userId
	 * @returns {Object}
	 */
	lobby.getUserById = (userId) => {
		const connectedUsers = lobby.getConnectedUsers();
		return connectedUsers.find((user) => {
			return user.id === userId;
		});
	};

	return lobby;
}
