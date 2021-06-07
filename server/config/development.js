const port = 4000;

module.exports = {
	port,
	cdn: `http://127.0.0.1:${port}`,
	session: {
		secret: 'EXxCP8sDAfPM7vJ4z6MQeN7oJzSBSh8NKGuSiNCs32qjngaRPC0IgiABV7MpCYu',
		sessionId: 'gamehub.sid',
		tableName: 'session'
	},
	db: {
		host: '127.0.0.1',
		database: 'game-hub',
		user: 'root',
		password: '1234'
	},
	uploads: {
		avatars: {
			directory: '../uploads/avatars/',
			maxSize: 1000000,
			validExtensions: ['png', 'jpg', 'jpeg'],
			defaultAvatar: 'default.png'
		}
	},
	minPasswordLength: 6
};
