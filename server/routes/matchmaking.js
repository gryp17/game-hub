import express from 'express';
import { isLoggedIn } from '../middleware/authentication';
import { sendResponse } from '../services/utils';
import matchmaking from '../services/matchmaking';

const router = express.Router();

router.get('/status', isLoggedIn, (req, res) => {
	const status = matchmaking.hasJoinedMatchmaking(req.session.user.id);
	sendResponse(res, status);
});

router.post('/join', isLoggedIn, (req, res) => {
	matchmaking.join(req.session.user.id);
	sendResponse(res, true);
});

router.post('/leave', isLoggedIn, (req, res) => {
	matchmaking.leave(req.session.user.id);
	sendResponse(res, true);
});

export default router;
