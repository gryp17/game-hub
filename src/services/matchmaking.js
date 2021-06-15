import API from './API';

export default {
	getStatus() {
		return API.get('/matchmaking/status');
	},
	join(game) {
		return API.post('/matchmaking/join', {
			game
		});
	},
	leave() {
		return API.post('/matchmaking/leave');
	},
	cancelChallenge() {
		return API.delete('/matchmaking/challenge');
	},
	acceptChallenge() {
		return API.post('/matchmaking/challenge/accept');
	}
};
