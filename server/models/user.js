import Sequelize from 'sequelize';
import config from '../config';

export default (db) => {
	return db.define('user', {
		username: {
			type: Sequelize.STRING
		},
		email: {
			type: Sequelize.STRING
		},
		password: {
			type: Sequelize.STRING
		},
		experience: {
			type: Sequelize.INTEGER,
			defaultValue: 0
		},
		bio: {
			type: Sequelize.STRING,
			defaultValue: ''
		},
		avatar: {
			type: Sequelize.STRING
		},
		avatarLink: {
			type: Sequelize.VIRTUAL,
			get() {
				return `${config.cdn}/avatars/${this.avatar}`;
			}
		}
	});
};
