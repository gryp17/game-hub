import express from 'express';
import { sendResponse } from '../services/utils';
import { userStatuses, availableGames } from '../config';

const router = express.Router();

router.get('/', (req, res) => {
	sendResponse(res, {
		userStatuses,
		availableGames
	});
});

export default router;
