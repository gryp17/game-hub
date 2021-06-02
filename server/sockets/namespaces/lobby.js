import { socketIsLoggedIn } from '../../middleware/authentication';
// import { sendSocketError } from '../../utils';
import { Game } from '../../models';
import cache from '../../cache';

export default function (io, app) {
	const lobby = io.of('/lobby');

	lobby.use(socketIsLoggedIn(app));

	lobby.on('connection', (socket) => {
		//update the user status
		lobby.setUserStatus(socket.user.id, 'online');

		socket.on('challengePlayer', (challengedUserId) => {
			const challengedUser = lobby.getUserById(challengedUserId);

			//send the challenge to the target user
			if (challengedUser) {
				//set the pending challenge data
				cache.addPendingChallenge(socket.id, challengedUser.socketId);

				lobby.to(challengedUser.socketId).emit('challenge', socket.user);
			}
		});

		socket.on('cancelChallenge', (challengedUserId) => {
			const challengedUser = lobby.getUserById(challengedUserId);

			if (challengedUser) {
				cache.deletePendingChallenge(socket.id);
				lobby.to(challengedUser.socketId).emit('cancelChallenge');
			}
		});

		socket.on('declineChallenge', (challengerId) => {
			const challenger = lobby.getUserById(challengerId);

			if (challenger) {
				cache.deletePendingChallenge(socket.id);
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

				cache.deletePendingChallenge(socket.id);

				//send the go to game event to both players
				lobby.to(challenger.socketId).emit('goToGame');
				lobby.to(socket.id).emit('goToGame');
			}
		});

		//disconnect event handler
		socket.on('disconnect', () => {
			//when the user disconnects cancel any pending game challenges that he is part of
			lobby.cancelPendingChallenges(socket.id);

			//update the user status
			lobby.setUserStatus(socket.user.id, 'offline');
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

	lobby.updateUserStatuses = () => {
		const statuses = cache.getUserStatuses();
		lobby.emit('updateUserStatuses', statuses);
	};

	lobby.setUserStatus = (userId, status) => {
		cache.setUserStatus(userId, status);
		lobby.updateUserStatuses();
	};

	lobby.cancelPendingChallenges = (socketId) => {
		const challenge = cache.getPendingChallenge(socketId);

		if (challenge) {
			lobby.to(challenge.to).emit('cancelChallenge');
			lobby.to(challenge.from).emit('declineChallenge');
			cache.deletePendingChallenge(socketId);
		}
	};

	return lobby;
}
