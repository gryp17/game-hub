import express from 'express';
import { sendResponse } from '../services/utils';
import { userStatuses, gameCodes } from '../config';

const router = express.Router();

router.get('/', (req, res) => {
	sendResponse(res, {
		userStatuses,
		availableGames: gameCodes
	});
});

export default router;
