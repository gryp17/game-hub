import express from 'express';
import escapeHtml from 'escape-html';
import { isLoggedIn } from '../middleware/authentication';
import { validate } from '../middleware/validator';
import { Message } from '../models';
import { sendResponse, sendApiError } from '../services/utils';
import { lobby } from '../sockets';

const router = express.Router();

const rules = {
	addMessage: {
		content: 'required'
	},
	getMessages: {
		limit: ['required', 'number'],
		offset: ['required', 'number']
	}
};

/**
 * Inserts a new message
 */
router.post('/', isLoggedIn, validate(rules.addMessage), async (req, res) => {
	const { content } = req.body;

	try {
		const messageRecord = await Message.create({
			content: escapeHtml(content),
			userId: req.session.user.id
		});

		lobby.sendMessage(messageRecord.toJSON());
		sendResponse(res, messageRecord.toJSON());
	} catch (err) {
		sendApiError(res, err);
	}
});

/**
 * Returns all messages
 */
router.get('/', isLoggedIn, validate(rules.getMessages), async (req, res) => {
	const maxMessagesPerRequest = 20;

	let limit = parseInt(req.query.limit);
	const offset = parseInt(req.query.offset);

	limit = limit > maxMessagesPerRequest ? maxMessagesPerRequest : limit;

	try {
		const messages = await Message.findAll({
			limit,
			offset,
			order: [
				['createdAt', 'desc']
			]
		});

		sendResponse(res, messages);
	} catch (err) {
		sendApiError(res, err);
	}
});

export default router;
