import { socketIsLoggedIn } from '../../middleware/authentication';
import { userStatuses, gameStatuses, experienceRewards, socketEvents } from '../../config';
import { calculateGameStats } from '../../services/misc';
import matchmaking from '../../services/matchmaking';
import cache from '../../services/cache';
import { User, Game } from '../../models';

export default function (io, app) {
	const lobby = io.of('/lobby');

	lobby.use(socketIsLoggedIn(app));

	lobby.on(socketEvents.connection, (socket) => {
		//update the user status
		lobby.setUserStatus(socket.user.id, userStatuses.online);

		//disconnect event handler
		socket.on(socketEvents.disconnect, () => {
			//when the user disconnects cancel any pending game challenges that he is part of
			lobby.cancelPendingChallenges(socket.user.id);

			//leave the matchmaking
			matchmaking.leave(socket.user.id);

			//cancel any matchmaking challenges
			lobby.cancelPendingMatchmakingChallenges(socket.user.id);

			//update the user status
			lobby.setUserStatus(socket.user.id, userStatuses.offline);
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
		lobby.emit(socketEvents.lobby.newUser, user);
	};

	/**
	 * Updates the user data
	 * @param {Object} user
	 */
	lobby.updateUser = (user) => {
		lobby.emit(socketEvents.lobby.updateUser, user);
	};

	lobby.updateUserStatuses = () => {
		const statuses = cache.getUserStatuses();
		lobby.emit(socketEvents.lobby.updateUserStatuses, statuses);
	};

	lobby.setUserStatus = (userId, status) => {
		cache.setUserStatus(userId, status);
		lobby.updateUserStatuses();
	};

	lobby.challengePlayer = (challengedUser, challenger, game, settings) => {
		lobby.to(challengedUser.socketId).emit(socketEvents.lobby.challenge, {
			user: challenger,
			game,
			settings
		});
	};

	lobby.cancelChallenge = (challengedUser) => {
		lobby.to(challengedUser.socketId).emit(socketEvents.lobby.cancelChallenge);
	};

	lobby.declineChallenge = (challenger) => {
		lobby.to(challenger.socketId).emit(socketEvents.lobby.declineChallenge);
	};

	lobby.goToGame = (players, game) => {
		players.forEach((player) => {
			lobby.to(player.socketId).emit(socketEvents.lobby.goToGame, game);
		});
	};

	lobby.cancelPendingChallenges = (userId) => {
		const challenge = cache.getPendingChallenge(userId);

		if (challenge) {
			lobby.to(challenge.from.socketId).emit(socketEvents.lobby.declineChallenge);
			lobby.to(challenge.to.socketId).emit(socketEvents.lobby.cancelChallenge);
			cache.deletePendingChallenge(userId);

			//figure out which user is still online and change only his status (the other user (userId) is the one that has disconnected)
			const targetUserId = challenge.from.id !== userId ? challenge.from.id : challenge.to.id;
			lobby.setUserStatus(targetUserId, userStatuses.online);
		}
	};

	lobby.onMatchFound = (userA, userB, game) => {
		[userA, userB].forEach((user) => {
			lobby.setUserStatus(user.id, userStatuses.busy);

			lobby.to(user.socketId).emit(socketEvents.lobby.foundMatch, game);
		});
	};

	lobby.cancelPendingMatchmakingChallenges = (userId) => {
		const challenge = cache.getMatchmakingChallenge(userId);

		if (challenge) {
			cache.deleteMatchmakingChallenge(userId);

			//send the event to each user and update their status
			Object.values(challenge.players).forEach((user) => {
				const userStatus = lobby.getUserById(user.id) ? userStatuses.online : userStatuses.offline;
				lobby.setUserStatus(user.id, userStatus);
				lobby.to(user.socketId).emit(socketEvents.lobby.cancelMatchmakingChallenge);
			});
		}
	};

	lobby.updateGameStats = async (users) => {
		const userIds = users.map((user) => {
			return user.id;
		});

		const userInstances = await User.findAll({
			where: {
				id: userIds
			},
			include: {
				model: Game,
				where: {
					status: gameStatuses.finished
				}
			}
		});

		//calculate the game stats for each user
		userInstances.forEach((user) => {
			const gameStats = calculateGameStats(user.id, user.games);

			lobby.emit(socketEvents.lobby.updateUser, {
				id: user.id,
				gameStats
			});
		});
	};

	lobby.updateUsersExperience = async (winnerId, users) => {
		users.forEach(async (user) => {
			const experienceGained = user.id === winnerId ? experienceRewards.WIN : experienceRewards.LOSS;

			const userInstance = await User.findByPk(user.id);
			userInstance.experience = userInstance.experience + experienceGained;
			await userInstance.save();

			lobby.emit(socketEvents.lobby.updateUser, {
				id: user.id,
				experience: userInstance.experience
			});
		});
	};

	/**
	 * Sends a new message to all users in the lobby
	 * @param {Object} message
	 */
	lobby.sendMessage = async (message) => {
		lobby.emit(socketEvents.lobby.newMessage, message);
	};

	return lobby;
}
