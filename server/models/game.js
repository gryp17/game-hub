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
			type: Sequelize.STRING(500),
			set(value) {
				this.setDataValue('data', JSON.stringify(value));
			},
			get() {
				const rawValue = this.getDataValue('data');
				let value;

				try {
					value = JSON.parse(rawValue);
				} catch (e) {
					value = {};
				}

				return value;
			}
		},
		settings: {
			type: Sequelize.STRING(500),
			set(value) {
				this.setDataValue('settings', JSON.stringify(value));
			},
			get() {
				const rawValue = this.getDataValue('settings');
				let value;

				try {
					value = JSON.parse(rawValue);
				} catch (e) {
					value = null;
				}

				return value;
			}
		},
		ragequit: {
			type: Sequelize.BOOLEAN,
			defaultValue: false
		}
	});
};
