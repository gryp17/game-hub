import Sequelize from 'sequelize';

export default (db) => {
	return db.define('game', {
		type: {
			type: Sequelize.STRING
		},
		status: {
			type: Sequelize.STRING
		},
		data: {
			type: Sequelize.JSON
		}
	});
};
