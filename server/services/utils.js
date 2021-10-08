import bcrypt from 'bcrypt';
import { socketEvents } from '../config';

/**
 * Hashes the provided value
 * @param {String} value
 * @param {Number} saltRounds
 * @returns {String}
 */
function makeHash(value, saltRounds = 10) {
	return bcrypt.hash(value, saltRounds);
}

/**
 * Checks if the value matches the hash
 * @param {String} value
 * @param {String} hash
 * @returns {Boolean}
 */
function compareHash(value, hash) {
	return bcrypt.compare(value, hash);
}

/**
 * Sends an error response
 * @param {Object} res
 * @param {Object} errors
 */
function sendError(res, errors) {
	res.json({
		errors
	});
}

/**
 * Sends an API error response
 * @param {Object} res
 * @param {Object} payload
 */
function sendApiError(res, payload) {
	res.json({
		apiError: payload.message ? payload.message : payload
	});
}

/**
 * Sends a socket error
 * @param {Object} io
 * @param {Object} payload
 */
function sendSocketError(io, payload) {
	io.emit(socketEvents.error, payload.toString ? payload.toString() : payload);
}

/**
 * Sends a response
 * @param {Object} res
 * @param {Object} payload
 */
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
