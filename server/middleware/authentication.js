import cookie from 'cookie';
import cookieParser from 'cookie-parser';
import config from '../config';
import { sendApiError } from '../utils';

/**
 * Checks if the user is logged in
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
function isLoggedIn(req, res, next) {
	if (req.session.user) {
		next();
	} else {
		return sendApiError(res, config.errorCodes.INVALID_AUTHENTICATION_TOKEN);
	}
}

/**
 * Checks if the socket session token is valid.
 * It also sets the session data in the socket instance.
 * @param {Object} socket
 * @param {Function} next
 */
function socketIsLoggedIn(app) {
	//hackfix to avoid circular dependency when requiring the app object
	return (socket, next) => {
		if (!socket.handshake.headers.cookie) {
			return next(new Error(config.errorCodes.INVALID_AUTHENTICATION_TOKEN));
		}

		//parse all cookies
		const cookies = cookie.parse(socket.handshake.headers.cookie);

		const sessionToken = cookies[config.session.sessionId];

		if (!sessionToken) {
			return next(new Error(config.errorCodes.INVALID_AUTHENTICATION_TOKEN));
		}

		//check if the session token is valid
		const unsignedToken = cookieParser.signedCookie(sessionToken, config.session.secret);

		//if the signed and unsigned tokens match then the token is not valid
		if (sessionToken === unsignedToken) {
			return next(new Error(config.errorCodes.INVALID_AUTHENTICATION_TOKEN));
		}

		//find the session data that matches this token and attach it to the socket
		const sessionStore = app.get('sessionStore');
		sessionStore.get(unsignedToken, (err, session) => {
			if (err) {
				return next(err);
			}

			if (!session || !session.user) {
				return next(new Error(config.errorCodes.INVALID_AUTHENTICATION_TOKEN));
			}

			socket.user = session.user;
			next();
		});
	};
}

export {
	isLoggedIn,
	socketIsLoggedIn
};
