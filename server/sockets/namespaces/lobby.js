export default function (io, server) {
	const lobby = io.of('/lobby');

	lobby.on('connection', (socket) => {
		console.log('--- user connected to lobby');

		//disconnect event handler
		socket.on('disconnect', () => {
			console.log('--- user disconnected from lobby');
		});
	});

	return lobby;
}
