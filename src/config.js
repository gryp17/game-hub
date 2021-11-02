const serverUrl = 'http://localhost:4000';

export default {
	socketUrl: serverUrl,
	socketLobbyNamespace: `${serverUrl}/lobby`,
	socketGameNamespace: `${serverUrl}/game`,
	apiUrl: `${serverUrl}/api`
};
