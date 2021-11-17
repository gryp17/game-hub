import Vue from 'vue';
import UserHttpService from '@/services/api/user';
import LobbyHttpService from '@/services/api/lobby';
import GameHttpService from '@/services/api/game';

const getDefaultState = () => {
	return {
		users: {},
		gameHistory: {
			total: 0,
			games: []
		}
	};
};

const state = getDefaultState();

const getters = {
	/**
	 * Contains the users map containing the up to date user information, user status and experience/level data
	 * @param {Object} state
	 * @param {Object} getters
	 * @param {Object} rootState
	 * @returns {Object}
	 */
	usersMap(state, getters, rootState) {
		const map = {};

		const userStatuses = rootState.config.userStatuses;

		Object.values(state.users).forEach((item) => {
			const user = {
				...item
			};

			//default status
			if (!user.status) {
				user.status = userStatuses.offline;
			}

			//generate the experience object
			user.experience = Vue.options.filters.experienceMap(user.experience);

			map[user.id] = user;
		});

		return map;
	},
	/**
	 * Contains the list of lobby users ordered by status
	 * @param {Object} state
	 * @param {Object} getters
	 * @param {Object} rootState
	 * @returns {Array}
	 */
	lobbyUsers(state, getters, rootState) {
		const userStatuses = rootState.config.userStatuses;

		return Object.values(getters.usersMap).sort((a, b) => {
			//first sort by status
			if (a.status.raw !== b.status.raw) {
				if (a.status.raw === userStatuses.offline) {
					return 1;
				}

				if (b.status.raw === userStatuses.offline) {
					return -1;
				}
			}

			//then by username
			return a.username.localeCompare(b.username);
		});
	},
	/**
	 * Contains the list of game history items
	 * @param {Object} state
	 * @param {Object} getters
	 * @returns {Array}
	 */
	gameHistory(state, getters) {
		//map the score userId to the corresponding user object
		const games = state.gameHistory.games.map((game) => {
			const result = {};

			Object.keys(game.result).forEach((userId) => {
				const points = game.result[userId];

				result[userId] = {
					user: getters.usersMap[userId],
					score: points
				};
			});

			return {
				...game,
				result
			};
		});

		return {
			...state.gameHistory,
			games
		};
	}
};

const mutations = {
	RESET_STATE(state) {
		Object.assign(state, getDefaultState());
	},
	SET_USERS(state, users) {
		state.users = users;
	},
	ADD_USER(state, user) {
		Vue.set(state.users, user.id, user);
	},
	UPDATE_USER(state, user) {
		//merge the current user data with the new data
		const updatedUser = {
			...state.users[user.id],
			...user
		};

		Vue.set(state.users, user.id, updatedUser);
	},
	UPDATE_USER_STATUSES(state, statuses) {
		Object.keys(state.users).forEach((userId) => {
			const status = statuses[userId] || {};

			const updatedUser = {
				...state.users[userId],
				status
			};

			Vue.set(state.users, userId, updatedUser);
		});
	},
	SET_GAME_HISTORY(state, gameHistory) {
		state.gameHistory = gameHistory;
	}
};

const actions = {
	/**
	 * Fetches all users
	 * @param {Object} context
	 */
	async getUsers(context) {
		try {
			const { data } = await UserHttpService.getUsers();
			const users = data || [];
			const usersMap = {};

			users.forEach((user) => {
				usersMap[user.id] = user;
			});

			context.commit('SET_USERS', usersMap);
		} catch (err) {
			Vue.toasted.global.apiError({
				message: `Failed to fetch the users: ${err}`
			});
		}
	},
	/**
	 * Updates the online users
	 * @param {Object} context
	 * @param {Object} statuses
	 */
	updateUserStatuses(context, statuses) {
		const userStatusesMap = {};

		const userStatuses = context.rootState.config.userStatuses;

		//TODO: update this list when more games are added
		const gameStatuses = [
			userStatuses.pong,
			userStatuses.volley,
			userStatuses.jumper
		];

		//for each user generate 3 types of status (raw, formatted and avatar)
		Object.keys(context.state.users).forEach((userId) => {
			const rawStatus = statuses[userId] || userStatuses.offline;
			const avatarStatus = gameStatuses.includes(rawStatus) ? userStatuses.busy : rawStatus;
			let formattedStatus = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1);

			if (gameStatuses.includes(rawStatus)) {
				formattedStatus = `Playing ${formattedStatus}`;
			}

			userStatusesMap[userId] = {
				raw: rawStatus,
				formatted: formattedStatus,
				avatar: avatarStatus
			};
		});

		context.commit('UPDATE_USER_STATUSES', userStatusesMap);
	},
	/**
	 * Handles the new user event
	 * @param {Object} context
	 * @param {Object} user
	 */
	newUserReceived(context, user) {
		context.commit('ADD_USER', user);
	},
	/**
	 * Handles the update user event
	 * @param {Object} context
	 * @param {Object} user
	 */
	updateUser(context, user) {
		context.commit('UPDATE_USER', user);
	},
	/**
	 * Sends a player challenge
	 * @param {Object} context
	 * @param {Object} data
	 * @returns {Promise}
	 */
	async challengePlayer(context, { userId, game, settings }) {
		try {
			const { data } = await LobbyHttpService.challengePlayer(userId, game, settings);

			//throw the errors and show them using a toast instead of handling them in a form or something
			if (data && data.errors) {
				const errors = Object.values(data.errors).join(', ');
				throw new Error(errors);
			}

			return true;
		} catch (err) {
			Vue.toasted.global.apiError({
				message: `Failed to challenge the player: ${err}`
			});
		}
	},
	/**
	 * Cancels a player challenge
	 * @param {Object} context
	 * @param {Number} userId
	 */
	async cancelChallenge(context, userId) {
		try {
			const { data } = await LobbyHttpService.cancelChallenge(userId);

			//throw the errors and show them using a toast instead of handling them in a form or something
			if (data && data.errors) {
				const errors = Object.values(data.errors).join(', ');
				throw new Error(errors);
			}
		} catch (err) {
			Vue.toasted.global.apiError({
				message: `Failed to cancel the challenge: ${err}`
			});
		}
	},
	/**
	 * Declines a player challenge
	 * @param {Object} context
	 * @param {Number} userId
	 */
	async declineChallenge(context, userId) {
		try {
			const { data } = await LobbyHttpService.declineChallenge(userId);

			//throw the errors and show them using a toast instead of handling them in a form or something
			if (data && data.errors) {
				const errors = Object.values(data.errors).join(', ');
				throw new Error(errors);
			}
		} catch (err) {
			Vue.toasted.global.apiError({
				message: `Failed to decline the challenge: ${err}`
			});
		}
	},
	/**
	 * Accepts a player challenge
	 * @param {Object} context
	 * @param {Number} userId
	 */
	async acceptChallenge(context, userId) {
		try {
			const { data } = await LobbyHttpService.acceptChallenge(userId);

			//throw the errors and show them using a toast instead of handling them in a form or something
			if (data && data.errors) {
				const errors = Object.values(data.errors).join(', ');
				throw new Error(errors);
			}
		} catch (err) {
			Vue.toasted.global.apiError({
				message: `Failed to accept the challenge: ${err}`
			});
		}
	},
	/**
	 * Fetches the user's game history
	 * @param {Object} context
	 * @param {Object} data
	 */
	async getGameHistory(context, { userId, limit, offset }) {
		try {
			const { data } = await GameHttpService.getHistory(userId, limit, offset);
			context.commit('SET_GAME_HISTORY', data);
		} catch (err) {
			Vue.toasted.global.apiError({
				message: `Failed to fetch the game history: ${err}`
			});
		}
	}
};

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions
};
