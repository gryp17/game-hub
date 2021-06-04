import API from './API';

export default {
	join() {
		return API.post('/matchmaking/join');
	},
	leave() {
		return API.post('/matchmaking/leave');
	}
};
