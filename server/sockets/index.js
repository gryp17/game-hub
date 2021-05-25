import lobby from './namespaces/lobby';
// import pong from './namespaces/pong';

export default function (io, app) {
	return {
		lobby: lobby(io, app)
		// pong: pong(io, app)
	};
}
