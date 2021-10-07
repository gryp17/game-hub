import Sequelize from 'sequelize';

export default (db) => {
	return db.define('game', {
		type: {
			type: Sequelize.STRING
		},
		status: {
			type: Sequelize.STRING
		},
		mode: {
			type: Sequelize.STRING
		},
		data: {
			type: Sequelize.STRING(500)
		},
		settings: {
			type: Sequelize.STRING(500)
		},
		ragequit: {
			type: Sequelize.BOOLEAN,
			defaultValue: false
		}
	});
};
