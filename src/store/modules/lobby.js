import Vue from 'vue';
import UserHttpService from '@/services/user';
import LobbyHttpService from '@/services/lobby';
import MatchmakingHttpService from '@/services/matchmaking';

const getDefaultState = () => {
	return {
		users: {},
		selectedUser: null,
		matchmakingEnabled: false
	};
};

const state = getDefaultState();

const getters = {
	users(state) {
		return Object.values(state.users).map((user) => {
			if (!user.status) {
				user.status = 'offline';
			}

			return user;
		}).sort((a, b) => {
			//first sort by status
			if (a.status !== b.status) {
				if (a.status === 'offline') {
					return 1;
				}

				if (b.status === 'offline') {
					return -1;
				}
			}

			//then by username
			return a.username > b.username;
		});
	},
	userProfile(state) {
		return state.users[state.selectedUser];
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
			const status = statuses[userId] || 'offline';

			const updatedUser = {
				...state.users[userId],
				status
			};

			Vue.set(state.users, userId, updatedUser);
		});
	},
	SET_SELECTED_USER(state, userId) {
		state.selectedUser = userId;
	},
	SET_MATCHMAKING_ENABLED(state, status) {
		state.matchmakingEnabled = status;
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
		context.commit('UPDATE_USER_STATUSES', statuses);
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
	 * Sets the selected user
	 * @param {Object} context
	 * @param {Number} userId
	 */
	setSelectedUser(context, userId) {
		context.commit('SET_SELECTED_USER', userId);
	},
	/**
	 * Handles the update user event
	 * @param {Object} context
	 * @param {Object} user
	 */
	updateUser(context, user) {
		context.commit('UPDATE_USER', user);

		if (user.id === context.rootGetters['auth/userSession'].id) {
			context.commit('auth/SET_USER_SESSION', user, { root: true });
		}
	},
	async challengePlayer(context, { userId, game }) {
		try {
			const { data } = await LobbyHttpService.challengePlayer(userId, game);

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
	async getMatchmakingStatus(context) {
		try {
			const { data } = await MatchmakingHttpService.getStatus();
			context.commit('SET_MATCHMAKING_ENABLED', data);
		} catch (err) {
			Vue.toasted.global.apiError({
				message: `Failed to get the matchmaking status: ${err}`
			});
		}
	},
	setMatchmakingEnabled(context, status) {
		context.commit('SET_MATCHMAKING_ENABLED', status);
	},
	async startMatchmaking(context, game) {
		try {
			const { data } = await MatchmakingHttpService.join(game);

			//throw the errors and show them using a toast instead of handling them in a form or something
			if (data && data.errors) {
				const errors = Object.values(data.errors).join(', ');
				throw new Error(errors);
			}

			context.commit('SET_MATCHMAKING_ENABLED', true);
		} catch (err) {
			Vue.toasted.global.apiError({
				message: `Failed to join the matchmaking: ${err}`
			});
		}
	},
	async stopMatchmaking(context) {
		try {
			await MatchmakingHttpService.leave();
			context.commit('SET_MATCHMAKING_ENABLED', false);
		} catch (err) {
			Vue.toasted.global.apiError({
				message: `Failed to leave the matchmaking: ${err}`
			});
		}
	},
	async cancelMatchmakingChallenge(context) {
		try {
			await MatchmakingHttpService.cancelChallenge();
		} catch (err) {
			Vue.toasted.global.apiError({
				message: `Failed to cancel the matchmaking challenge: ${err}`
			});
		}
	},
	async acceptMatchmakingChallenge(context) {
		try {
			const { data } = await MatchmakingHttpService.acceptChallenge();

			//throw the errors and show them using a toast instead of handling them in a form or something
			if (data && data.errors) {
				const errors = Object.values(data.errors).join(', ');
				throw new Error(errors);
			}
		} catch (err) {
			Vue.toasted.global.apiError({
				message: `Failed to accept the matchmaking challenge: ${err}`
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
