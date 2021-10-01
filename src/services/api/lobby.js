import API from './API';

export default {
	challengePlayer(userId, game, settings) {
		return API.post('/lobby/challenge', {
			userId,
			game,
			settings
		});
	},
	cancelChallenge(userId) {
		return API.delete('/lobby/challenge', {
			data: {
				userId
			}
		});
	},
	declineChallenge(userId) {
		return API.post('/lobby/challenge/decline', {
			userId
		});
	},
	acceptChallenge(userId) {
		return API.post('/lobby/challenge/accept', {
			userId
		});
	}
};
