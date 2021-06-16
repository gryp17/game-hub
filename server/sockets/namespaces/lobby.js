import { socketIsLoggedIn } from '../../middleware/authentication';
import { userStatuses } from '../../config';
import matchmaking from '../../services/matchmaking';
import cache from '../../services/cache';

export default function (io, app) {
	const lobby = io.of('/lobby');

	lobby.use(socketIsLoggedIn(app));

	lobby.on('connection', (socket) => {
		//update the user status
		lobby.setUserStatus(socket.user.id, userStatuses.ONLINE);

		//disconnect event handler
		socket.on('disconnect', () => {
			//when the user disconnects cancel any pending game challenges that he is part of
			lobby.cancelPendingChallenges(socket.user.id);

			//leave the matchmaking
			matchmaking.leave(socket.user.id);

			//cancel any matchmaking challenges
			lobby.cancelPendingMatchmakingChallenges(socket.user.id);

			//update the user status
			lobby.setUserStatus(socket.user.id, userStatuses.OFFLINE);
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

	/**
	 * Notifies all clients about the new user
	 * @param {Number} userId
	 */
	lobby.newUser = async (user) => {
		lobby.emit('newUser', user);
	};

	/**
	 * Updates the user data
	 * @param {Object} user
	 */
	lobby.updateUser = (user) => {
		lobby.emit('updateUser', user);
	};

	lobby.updateUserStatuses = () => {
		const statuses = cache.getUserStatuses();
		lobby.emit('updateUserStatuses', statuses);
	};

	lobby.setUserStatus = (userId, status) => {
		cache.setUserStatus(userId, status);
		lobby.updateUserStatuses();
	};

	lobby.challengePlayer = (challengedUser, challenger, game) => {
		lobby.to(challengedUser.socketId).emit('challenge', {
			game,
			user: challenger
		});
	};

	lobby.cancelChallenge = (challengedUser) => {
		lobby.to(challengedUser.socketId).emit('cancelChallenge');
	};

	lobby.declineChallenge = (challenger) => {
		lobby.to(challenger.socketId).emit('declineChallenge');
	};

	lobby.goToGame = (players, game) => {
		players.forEach((player) => {
			lobby.to(player.socketId).emit('goToGame', game);
		});
	};

	lobby.cancelPendingChallenges = (userId) => {
		const challenge = cache.getPendingChallenge(userId);

		if (challenge) {
			lobby.to(challenge.from.socketId).emit('declineChallenge');
			lobby.to(challenge.to.socketId).emit('cancelChallenge');
			cache.deletePendingChallenge(userId);

			//figure out which user is still online and change only his status (the other user (userId) is the one that has disconnected)
			const targetUserId = challenge.from.id !== userId ? challenge.from.id : challenge.to.id;
			lobby.setUserStatus(targetUserId, userStatuses.ONLINE);
		}
	};

	lobby.onMatchFound = (userA, userB, game) => {
		[userA, userB].forEach((user) => {
			lobby.setUserStatus(user.id, userStatuses.BUSY);

			lobby.to(user.socketId).emit('foundMatch', {
				game
			});
		});
	};

	lobby.cancelPendingMatchmakingChallenges = (userId) => {
		const challenge = cache.getMatchmakingChallenge(userId);

		if (challenge) {
			cache.deleteMatchmakingChallenge(userId);

			//send the event to each user and update their status
			Object.values(challenge.players).forEach((user) => {
				const userStatus = lobby.getUserById(user.id) ? userStatuses.ONLINE : userStatuses.OFFLINE;
				lobby.setUserStatus(user.id, userStatus);
				lobby.to(user.socketId).emit('cancelMatchmakingChallenge');
			});
		}
	};

	return lobby;
}
