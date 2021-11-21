import express from 'express';
import { Settings } from '../models';
import { sendResponse, sendApiError } from '../services/utils';
import { isLoggedIn } from '../middleware/authentication';

const router = express.Router();

/**
 * Returns the user's game settings
 */
router.get('/', isLoggedIn, async (req, res) => {
	try {
		const settingsRecord = await Settings.findOne({
			where: {
				userId: req.session.user.id
			}
		});

		sendResponse(res, settingsRecord);
	} catch (err) {
		sendApiError(res, err);
	}
});

export default router;
