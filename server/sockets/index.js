import createSocket from 'socket.io';
import createLobby from './namespaces/lobby';
import createGame from './namespaces/game';

let io;
let lobby;
let game;

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
	game = createGame(io, app);

	return {
		io,
		lobby,
		game
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
	game,
	initSockets
};
