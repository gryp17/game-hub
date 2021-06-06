import express from 'express';
import sequelize from 'sequelize';
import multipart from 'connect-multiparty';
import fs from 'fs';
import { promisify } from 'util';
import path from 'path';
import md5 from 'md5';
import app from '../app';
import { isLoggedIn } from '../middleware/authentication';
import { validate } from '../middleware/validator';
import { User } from '../models';
import { sendResponse, sendApiError, sendError, makeHash } from '../services/utils';
import { errorCodes, uploads } from '../config';

const unlink = promisify(fs.unlink);
const rename = promisify(fs.rename);

const router = express.Router();

const rules = {
	updateUser: {
		username: ['required', 'min-3', 'max-30'],
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
		const users = await User.findAll({
			attributes: [
				'id',
				'username',
				'bio',
				'avatar',
				'avatarLink',
				'createdAt',
				'updatedAt'
			]
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
	const chat = app.get('chat');
	const { username, password, bio } = req.body;

	const updatedFields = {
		username,
		bio
	};

	try {
		//check if the username is used by another user
		const user = await User.findOne({
			where: {
				username,
				id: {
					[sequelize.Op.not]: req.session.user.id
				}
			}
		});

		if (user) {
			return sendError(res, {
				username: errorCodes.ALREADY_IN_USE
			});
		}

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
				'createdAt',
				'updatedAt'
			]
		});

		//update the session
		req.session.user = updatedUser.toJSON();

		//notify all users about the changes
		chat.updateUser(updatedUser.toJSON());

		sendResponse(res, updatedUser.toJSON());
	} catch (err) {
		sendApiError(res, err);
	}
});

export default router;
