import Vue from 'vue';
import moment from 'moment';
import MessageHttpService from '@/services/api/message';

const getDefaultState = () => {
	return {
		messages: []
	};
};

const state = getDefaultState();

const getters = {
	messages(state, getters, rootState) {
		const usersMap = rootState.lobby.users;

		return [...state.messages].map((message) => {
			//set the user/author field for each message
			return {
				...message,
				user: usersMap[message.userId]
			};
		}).sort((a, b) => {
			return moment(b.createdAt) - moment(a.createdAt);
		});
	}
};

const mutations = {
	RESET_STATE(state) {
		Object.assign(state, getDefaultState());
	},
	SET_MESSAGES(state, messages) {
		state.messages = messages;
	},
	ADD_MESSAGES(state, messages) {
		state.messages = state.messages.concat(messages);
	},
	ADD_MESSAGE(state, message) {
		state.messages.push(message);
	}
};

const actions = {
	/**
	 * Sends a new message
	 * @param {Object} context
	 * @param {Object} data
	 */
	async sendMessage(context, content) {
		try {
			await MessageHttpService.sendMessage(content);
		} catch (err) {
			Vue.toasted.global.apiError({
				message: `Failed to send the message: ${err}`
			});
		}
	},
	/**
	 * Fetches all the messages
	 * @param {Object} context
	 * @param {Object} data
	 * @returns {Promise}
	 */
	async getMessages(context, { limit, offset }) {
		const mutation = offset === 0 ? 'SET_MESSAGES' : 'ADD_MESSAGES';

		try {
			const { data } = await MessageHttpService.getMessages(limit, offset);
			context.commit(mutation, data);
			return data;
		} catch (err) {
			Vue.toasted.global.apiError({
				message: `Failed to fetch messages: ${err}`
			});
		}
	},
	/**
	 * Handles the message received event
	 * @param {Object} context
	 * @param {Object} message
	 * @returns {Promise}
	 */
	messageReceived(context, message) {
		context.commit('ADD_MESSAGE', message);
	}
};

export default {
	namespaced: true,
	getters,
	state,
	mutations,
	actions
};
