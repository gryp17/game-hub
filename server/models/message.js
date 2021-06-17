import Sequelize from 'sequelize';

export default (db) => {
	return db.define('message', {
		content: {
			type: Sequelize.STRING(1400)
		}
	}, {
		charset: 'utf8mb4', //needed for the emojis
		collate: 'utf8mb4_bin'
	});
};
