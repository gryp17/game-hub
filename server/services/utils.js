import bcrypt from 'bcrypt';
import { socketEvents } from '../config';

function makeHash(value, saltRounds = 10) {
	return bcrypt.hash(value, saltRounds);
}

function compareHash(value, hash) {
	return bcrypt.compare(value, hash);
}

function sendError(res, errors) {
	res.json({
		errors
	});
}

function sendApiError(res, payload) {
	res.json({
		apiError: payload.message ? payload.message : payload
	});
}

function sendSocketError(io, payload) {
	io.emit(socketEvents.ERROR, payload.toString ? payload.toString() : payload);
}

function sendResponse(res, payload) {
	res.json(payload);
}

export {
	makeHash,
	compareHash,
	sendError,
	sendApiError,
	sendSocketError,
	sendResponse
};
