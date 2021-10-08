import express from 'express';
import { sendResponse } from '../services/utils';
import { userStatuses, gameCodes, socketEvents } from '../config';

const router = express.Router();

/**
 * Returns the app config
 */
router.get('/', (req, res) => {
	sendResponse(res, {
		userStatuses,
		availableGames: gameCodes,
		socketEvents
	});
});

export default router;
