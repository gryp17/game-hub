import { socketIsLoggedIn } from '../../middleware/authentication';
// import { sendSocketError } from '../../services/utils';
import { userStatuses, availableGames } from '../../config';
import { Game } from '../../models';
import matchmaking from '../../services/matchmaking';
import cache from '../../services/cache';

export default function (io, app) {
	const lobby = io.of('/lobby');

	lobby.use(socketIsLoggedIn(app));

	lobby.on('connection', (socket) => {
		//update the user status
		lobby.setUserStatus(socket.user.id, userStatuses.ONLINE);

		socket.on('challengePlayer', (challengedUserId) => {
			const challengedUser = lobby.getUserById(challengedUserId);

			//send the challenge to the target user
			if (challengedUser) {
				//set the pending challenge data

				cache.addPendingChallenge({
					id: socket.user.id,
					socketId: socket.id
				}, {
					id: challengedUser.id,
					socketId: challengedUser.socketId
				});

				lobby.to(challengedUser.socketId).emit('challenge', {
					game: availableGames.PONG,
					user: socket.user
				});

				//set both users status to busy while the challenge is still active
				lobby.setUserStatus(socket.user.id, userStatuses.BUSY);
				lobby.setUserStatus(challengedUser.id, userStatuses.BUSY);
			}
		});

		socket.on('cancelChallenge', (challengedUserId) => {
			const challengedUser = lobby.getUserById(challengedUserId);

			if (challengedUser) {
				cache.deletePendingChallenge(socket.user.id);
				lobby.to(challengedUser.socketId).emit('cancelChallenge');

				lobby.setUserStatus(socket.user.id, userStatuses.ONLINE);
				lobby.setUserStatus(challengedUser.id, userStatuses.ONLINE);
			}
		});

		socket.on('declineChallenge', (challengerId) => {
			const challenger = lobby.getUserById(challengerId);

			if (challenger) {
				cache.deletePendingChallenge(socket.user.id);
				lobby.to(challenger.socketId).emit('declineChallenge');

				lobby.setUserStatus(socket.user.id, userStatuses.ONLINE);
				lobby.setUserStatus(challenger.id, userStatuses.ONLINE);
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

				cache.deletePendingChallenge(socket.user.id);

				//send the go to game event to both players
				lobby.to(challenger.socketId).emit('goToGame');
				lobby.to(socket.id).emit('goToGame');
			}
		});

		socket.on('cancelMatchmakingChallenge', () => {
			lobby.cancelPendingMatchmakingChallenges(socket.user.id);
		});

		socket.on('acceptMatchmakingChallenge', async () => {
			cache.updateMatchmakingChallenge(socket.user.id, true);
			const challenge = cache.getMatchmakingChallenge(socket.user.id);

			if (challenge) {
				//check if both players have accepted the matchmaking challenge
				const ready = Object.values(challenge).every((user) => {
					return user.accepted;
				});

				if (ready) {
					cache.deleteMatchmakingChallenge(socket.user.id);

					//create the game with both users
					const gameInstance = await Game.create({
						type: 'pong',
						status: 'pending'
					});

					await gameInstance.setUsers(Object.keys(challenge));

					//send the socket event to both users
					Object.values(challenge).forEach((user) => {
						lobby.to(user.socketId).emit('goToGame');
					});
				}
			}
		});

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

	lobby.onMatchFound = (userA, userB) => {
		[userA, userB].forEach((user) => {
			lobby.setUserStatus(user.id, userStatuses.BUSY);

			lobby.to(user.socketId).emit('foundMatch', {
				game: availableGames.PONG
			});
		});
	};

	lobby.cancelPendingMatchmakingChallenges = (userId) => {
		const challenge = cache.getMatchmakingChallenge(userId);

		if (challenge) {
			cache.deleteMatchmakingChallenge(userId);

			//send the event to each user and update their status
			Object.values(challenge).forEach((user) => {
				const userStatus = lobby.getUserById(user.id) ? userStatuses.ONLINE : userStatuses.OFFLINE;
				lobby.setUserStatus(user.id, userStatus);
				lobby.to(user.socketId).emit('cancelMatchmakingChallenge');
			});
		}
	};

	return lobby;
}
