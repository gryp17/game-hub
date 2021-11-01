import express from 'express';
import multipart from 'connect-multiparty';
import fs from 'fs';
import { promisify } from 'util';
import path from 'path';
import md5 from 'md5';
import { isLoggedIn } from '../middleware/authentication';
import { validate } from '../middleware/validator';
import { User, Game } from '../models';
import { sendResponse, sendApiError, makeHash } from '../services/utils';
import { calculateGameStats } from '../services/misc';
import { uploads, gameStatuses } from '../config';
import { lobby } from '../sockets';

const unlink = promisify(fs.unlink);
const rename = promisify(fs.rename);

const router = express.Router();

const rules = {
	updateUser: {
		password: ['optional', 'strong-password', 'max-100'],
		repeatPassword: 'matches(password)',
		bio: ['optional', 'max-200'],
		avatar: ['optional', 'valid-avatar']
	}
};

/**
 * Uploads the submited avatar to the avatars directory
 * @param {Number} userId
 * @param {Object} file
 * @returns {String}
 */
async function uploadAvatar(userId, file) {
	let extension = path.extname(file.originalFilename).replace('.', '').toLowerCase();
	extension = extension ? `.${extension}` : '';

	const user = await User.findByPk(userId);

	//if the user doesn't use the default avatar delete his current avatar before uploading the new one
	if (user && user.avatar !== uploads.avatars.defaultAvatar) {
		const oldAvatar = path.join(__dirname, uploads.avatars.directory, user.avatar);
		await unlink(oldAvatar);
	}

	//rename/move the avatar file
	const username = user.username;
	const avatar = `${md5(username) + new Date().getTime()}${extension}`;
	const destination = path.join(__dirname, uploads.avatars.directory, avatar);

	//move the temporal file to the real avatars directory
	await rename(file.path, destination);

	return avatar;
}

/**
 * Returns all users
 */
router.get('/all', isLoggedIn, async (req, res) => {
	try {
		let users = await User.findAll({
			attributes: [
				'id',
				'username',
				'bio',
				'experience',
				'avatar',
				'avatarLink',
				'createdAt',
				'updatedAt'
			],
			include: {
				model: Game,
				required: false,
				where: {
					status: gameStatuses.finished
				}
			}
		});

		//calculate the game stats for each user
		users = users.map((userInstance) => {
			const user = userInstance.toJSON();
			user.gameStats = calculateGameStats(user.id, user.games);
			delete user.games;

			return user;
		});

		sendResponse(res, users);
	} catch (err) {
		sendApiError(res, err);
	}
});

/**
 * Updates the user data
 */
router.put('/', isLoggedIn, multipart(), validate(rules.updateUser), async (req, res) => {
	const { password, bio, sound, music } = req.body;

	const updatedFields = {
		bio,
		sound,
		music
	};

	try {
		if (password) {
			const hashedPassword = await makeHash(password);
			updatedFields.password = hashedPassword;
		}

		if (req.files && req.files.avatar) {
			const avatar = await uploadAvatar(req.session.user.id, req.files.avatar);
			updatedFields.avatar = avatar;
		}

		//update the user data
		await User.update(updatedFields, {
			where: {
				id: req.session.user.id
			}
		});

		const updatedUser = await User.findByPk(req.session.user.id, {
			attributes: [
				'id',
				'username',
				'bio',
				'avatar',
				'avatarLink',
				'sound',
				'music',
				'createdAt',
				'updatedAt'
			]
		});

		//update the session
		req.session.user = updatedUser.toJSON();

		//notify all users about the changes
		lobby.updateUser(updatedUser.toJSON());

		sendResponse(res, updatedUser.toJSON());
	} catch (err) {
		sendApiError(res, err);
	}
});

export default router;
