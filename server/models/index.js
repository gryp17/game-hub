import Sequelize from 'sequelize';
import config from '../config';
import { makeHash } from '../utils';

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

//setup relations
User.belongsToMany(Game, {
	through: GameUser
});

Game.belongsToMany(User, {
	through: GameUser
});

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

			await Promise.all(users.map((user) => {
				return User.create({
					...user,
					avatar: config.uploads.avatars.defaultAvatar,
					password: hashedPassword
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
	sync,
	syncAndSeed
};
