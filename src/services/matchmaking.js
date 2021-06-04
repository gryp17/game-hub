import API from './API';

export default {
	getStatus() {
		return API.get('/matchmaking/status');
	},
	join() {
		return API.post('/matchmaking/join');
	},
	leave() {
		return API.post('/matchmaking/leave');
	}
};
