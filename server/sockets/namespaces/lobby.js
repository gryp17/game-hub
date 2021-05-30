import { socketIsLoggedIn } from '../../middleware/authentication';
// import { sendSocketError } from '../../utils';
import { Game } from '../../models';

export default function (io, server) {
	const lobby = io.of('/lobby');
	let pendingChallenges = [];

	lobby.use(socketIsLoggedIn(server));

	lobby.on('connection', (socket) => {
		console.log('--- user connected to lobby');

		socket.on('challengePlayer', async (challengedUserId) => {
			const challengedUser = lobby.getUserById(challengedUserId);

			//send the challenge to the target user
			if (challengedUser) {
				//set the pending challenge data
				lobby.addPendingChallenge(socket.id, challengedUser.socketId);

				lobby.to(challengedUser.socketId).emit('challenge', socket.user);
			}
		});

		socket.on('cancelChallenge', (challengedUserId) => {
			const challengedUser = lobby.getUserById(challengedUserId);

			if (challengedUser) {
				lobby.removePendingChallenges(socket.id);
				lobby.to(challengedUser.socketId).emit('cancelChallenge');
			}
		});

		socket.on('declineChallenge', (challengerId) => {
			const challenger = lobby.getUserById(challengerId);

			if (challenger) {
				lobby.removePendingChallenges(socket.id);
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

				lobby.removePendingChallenges(socket.id);

				//send the go to game event to both players
				lobby.to(challenger.socketId).emit('goToGame');
				lobby.to(socket.id).emit('goToGame');
			}
		});

		//disconnect event handler
		socket.on('disconnect', () => {
			//when the user disconnects cancel any pending game challenges that he is part of
			lobby.cancelPendingChallenges(socket.id);

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

	lobby.addPendingChallenge = (from, to) => {
		pendingChallenges.push({
			from,
			to
		});
	};

	lobby.cancelPendingChallenges = (socketId) => {
		pendingChallenges = pendingChallenges.filter(({ from, to }) => {
			if (from === socketId || to === socketId) {
				lobby.to(to).emit('cancelChallenge');
				lobby.to(from).emit('declineChallenge');
				return false;
			}

			return true;
		});
	};

	lobby.removePendingChallenges = (socketId) => {
		pendingChallenges = pendingChallenges.filter(({ from, to }) => {
			return (from !== socketId && to !== socketId);
		});
	};

	return lobby;
}
