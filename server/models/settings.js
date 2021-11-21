import Sequelize from 'sequelize';

export default (db) => {
	return db.define('settings', {
		sound: {
			type: Sequelize.BOOLEAN,
			defaultValue: true
		},
		music: {
			type: Sequelize.BOOLEAN,
			defaultValue: true
		},
		controls: {
			type: Sequelize.STRING(500),
			set(value) {
				this.setDataValue('controls', JSON.stringify(value));
			},
			get() {
				const rawValue = this.getDataValue('controls');
				let value;

				try {
					value = JSON.parse(rawValue);
				} catch (e) {
					value = {};
				}

				return value;
			}
		}
	});
};
