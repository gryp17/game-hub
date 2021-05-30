import createSocket from 'socket.io';
import lobby from './namespaces/lobby';
import pong from './namespaces/pong';

let io;

function initSockets(server, app) {
	io = createSocket(server);

	//register all namespaces
	lobby(io, app);
	pong(io, app);

	return io;
}

export {
	io,
	initSockets
};
