import Sequelize from 'sequelize';
import config from '../config';
import { makeHash } from '../services/utils';

const db = new Sequelize(config.db.database, config.db.user, config.db.password, {
	host: config.db.host,
	dialect: 'mysql',
	define: {
		//don't pluralize table names
		freezeTableName: true,
		//needed for the emojis
		collate: 'utf8mb4_bin'
	}
});

const User = require('./user').default(db);
const Game = require('./game').default(db);
const GameUser = require('./game-user').default(db);
const Message = require('./message').default(db);
const Settings = require('./settings').default(db);

//setup relations
User.belongsToMany(Game, {
	through: GameUser
});

Game.belongsToMany(User, {
	through: GameUser
});

Game.belongsTo(User, {
	foreignKey: {
		name: 'winner',
		allowNull: true
	}
});

Message.belongsTo(User);

User.hasOne(Settings);

Settings.belongsTo(User);

/**
 * Syncs the models and the mysql tables
 */
const sync = () => {
	return db.sync({
		//drops and recreates the tables
		force: true
	});
};

/**
 * Syncs the models and then inserts the seed data
 */
const syncAndSeed = async () => {
	const users = [
		{
			email: 'plamen@abv.bg',
			username: 'gryp5'
		},
		{
			email: 'fran@gmail.com',
			username: 'belias1234'
		},
		{
			email: 'jacobo@gmail.com',
			username: 'leank'
		}
	];

	try {
		await sync();

		//add the test users only when in development mode
		if (process.env.NODE_ENV === 'development') {
			//add all the seed users
			const hashedPassword = await makeHash('1234');

			await Promise.all(users.map(async (user) => {
				const userInstance = await User.create({
					...user,
					avatar: config.uploads.avatars.defaultAvatar,
					password: hashedPassword
				});

				//add the settings records for the user
				return userInstance.createSetting({
					controls: config.defaultControls
				});
			}));
		}
	} catch (err) {
		console.error('Failed to sync the database', err);
	}
};

export {
	User,
	Game,
	GameUser,
	Message,
	Settings,
	sync,
	syncAndSeed
};
