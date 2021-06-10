import express from 'express';
import { isLoggedIn } from '../middleware/authentication';
import { sendResponse, sendApiError } from '../services/utils';
import matchmaking from '../services/matchmaking';
import { lobby } from '../sockets';
import { errorCodes, userStatuses } from '../config';

const router = express.Router();

router.get('/status', isLoggedIn, (req, res) => {
	const status = matchmaking.hasJoinedMatchmaking(req.session.user.id);
	sendResponse(res, status);
});

router.post('/join', isLoggedIn, (req, res) => {
	//get the user socket id from the lobby
	const socketUser = lobby.getUserById(req.session.user.id);

	if (!socketUser) {
		return sendApiError(res, errorCodes.INVALID_USER_ID);
	}

	lobby.setUserStatus(req.session.user.id, userStatuses.MATCHMAKING);

	matchmaking.join(req.session.user.id, socketUser.socketId);
	sendResponse(res, true);
});

router.post('/leave', isLoggedIn, (req, res) => {
	lobby.setUserStatus(req.session.user.id, userStatuses.ONLINE);

	matchmaking.leave(req.session.user.id);
	sendResponse(res, true);
});

export default router;
