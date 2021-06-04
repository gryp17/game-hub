import express from 'express';
import { isLoggedIn } from '../middleware/authentication';
import { sendResponse } from '../utils';
import matchmaking from '../matchmaking';

const router = express.Router();

router.post('/join', isLoggedIn, (req, res) => {
	matchmaking.join(req.session.user.id);
	sendResponse(res, true);
});

router.post('/leave', isLoggedIn, (req, res) => {
	matchmaking.leave(req.session.user.id);
	sendResponse(res, true);
});

export default router;
