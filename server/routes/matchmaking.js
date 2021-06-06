import express from 'express';
import { isLoggedIn } from '../middleware/authentication';
import { sendResponse, sendApiError } from '../services/utils';
import matchmaking from '../services/matchmaking';
import { io } from '../sockets';
import { errorCodes } from '../config';

const router = express.Router();

router.get('/status', isLoggedIn, (req, res) => {
	const status = matchmaking.hasJoinedMatchmaking(req.session.user.id);
	sendResponse(res, status);
});

router.post('/join', isLoggedIn, (req, res) => {
	//get the user socket id from the lobby
	const lobbyNamespace = io.of('/lobby');
	const socketUser = lobbyNamespace.getUserById(req.session.user.id);

	if (!socketUser) {
		return sendApiError(res, errorCodes.INVALID_USER_ID);
	}

	matchmaking.join(req.session.user.id, socketUser.socketId);
	sendResponse(res, true);
});

router.post('/leave', isLoggedIn, (req, res) => {
	matchmaking.leave(req.session.user.id);
	sendResponse(res, true);
});

export default router;
