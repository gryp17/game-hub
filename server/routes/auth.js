import express from 'express';
import { uploads, errorCodes, defaultControls } from '../config';
import { User } from '../models';
import { isLoggedIn } from '../middleware/authentication';
import { validate } from '../middleware/validator';
import { sendResponse, sendError, sendApiError, compareHash, makeHash } from '../services/utils';
import { calculateGameStats } from '../services/misc';
import { lobby } from '../sockets';

const router = express.Router();

const rules = {
	login: {
		email: ['required', 'email'],
		password: 'required'
	},
	signup: {
		email: ['required', 'max-100', 'email', 'unique'],
		username: ['required', 'min-3', 'max-30', 'unique'],
		password: ['required', 'strong-password', 'max-100'],
		repeatPassword: ['required', 'matches(password)']
	}
};

/**
 * Logs in the user with the provided credentials
 */
router.post('/login', validate(rules.login), async (req, res) => {
	const email = req.body.email;
	const password = req.body.password;

	try {
		const record = await User.findOne({
			where: {
				email
			}
		});

		if (!record) {
			return sendError(res, {
				password: errorCodes.wrongPassword
			});
		}

		const valid = await compareHash(password, record.password);

		if (!valid) {
			return sendError(res, {
				password: errorCodes.wrongPassword
			});
		}

		const user = record.toJSON();
		delete user.password;

		req.session.user = user;

		sendResponse(res, {
			user
		});
	} catch (err) {
		sendApiError(res, err);
	}
});

/**
 * Signs up the user with the provided data
 */
router.post('/signup', validate(rules.signup), async (req, res) => {
	const email = req.body.email;
	const username = req.body.username;
	const password = req.body.password;

	try {
		const hashedPassword = await makeHash(password);
		const userInstance = await User.create({
			email,
			password: hashedPassword,
			username,
			avatar: uploads.avatars.defaultAvatar
		});

		//add the settings record for the user
		await userInstance.createSetting({
			controls: defaultControls
		});

		const user = userInstance.toJSON();
		delete user.password;

		req.session.user = user;

		//calculate the game stats (pass an empty games list since the user just signed up)
		user.gameStats = calculateGameStats(user.id, []);

		//notify all connected users about the new user
		lobby.newUser(user);

		sendResponse(res, {
			user
		});
	} catch (err) {
		sendApiError(res, err);
	}
});

/**
 * Returns the current user session
 */
router.get('/session', isLoggedIn, (req, res) => {
	sendResponse(res, {
		user: req.session.user
	});
});

/**
 * Logs out the user
 */
router.get('/logout', (req, res) => {
	req.session.destroy(() => {
		sendResponse(res, true);
	});
});

export default router;
