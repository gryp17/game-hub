import createSocket from 'socket.io';
import createLobby from './namespaces/lobby';
import createPong from './namespaces/pong';

let io;
let lobby;
let pong;

/**
 * Inits the sockets listeners
 * @param {Object} server
 * @param {Object} app
 * @returns {Object}
 */
function initSockets(server, app) {
	io = createSocket(server);

	//register all namespaces
	lobby = createLobby(io, app);
	pong = createPong(io, app);

	return {
		io,
		lobby,
		pong
	};
}

/*
How to call the namespaces from different modules:

import { lobby } from './sockets';
lobby.randomFunction();

OR:

import { io } from './sockets';
const lobby = io.of('/lobby');
lobby.randomFunction();
*/

export {
	io,
	lobby,
	pong,
	initSockets
};
