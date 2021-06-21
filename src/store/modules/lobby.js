import Vue from 'vue';
import UserHttpService from '@/services/user';
import LobbyHttpService from '@/services/lobby';

const getDefaultState = () => {
	return {
		users: {}
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
			if (a.status.raw !== b.status.raw) {
				if (a.status.raw === 'offline') {
					return 1;
				}

				if (b.status.raw === 'offline') {
					return -1;
				}
			}

			//then by username
			return a.username > b.username;
		});
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
			userStatuses.PONG
		];

		//for each user generate 3 types of status (raw, formatted and avatar)
		Object.keys(context.state.users).forEach((userId) => {
			const rawStatus = statuses[userId] || 'offline';
			const avatarStatus = gameStatuses.includes(rawStatus) ? 'busy' : rawStatus;
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
	}
};

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions
};
