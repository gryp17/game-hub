import Vue from 'vue';
import UserHttpService from '@/services/user';

const getDefaultState = () => {
	return {
		users: {},
		selectedUser: null
	};
};

const state = getDefaultState();

const getters = {
	users(state) {
		return Object.values(state.users);
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
	UPDATE_ONLINE_USERS(state, onlineUsers) {
		Object.keys(state.users).forEach((userId) => {
			const online = onlineUsers.includes(parseInt(userId));

			const updatedUser = {
				...state.users[userId],
				online
			};

			Vue.set(state.users, userId, updatedUser);
		});
	},
	SET_SELECTED_USER(state, userId) {
		state.selectedUser = userId;
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
	 * Sets the online users
	 * @param {Object} context
	 * @param {Array} onlineUsers
	 */
	setOnlineUsers(context, onlineUsers) {
		context.commit('UPDATE_ONLINE_USERS', onlineUsers);
	},
	/**
	 * Updates the online users
	 * @param {Object} context
	 * @param {Array} onlineUsers
	 */
	updateOnlineUsers(context, onlineUsers) {
		context.commit('UPDATE_ONLINE_USERS', onlineUsers);
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

		if (user.id === context.rootState.auth.userSession.id) {
			context.commit('auth/SET_USER_SESSION', user, { root: true });
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
