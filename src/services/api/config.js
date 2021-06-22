import API from './API';

export default {
	getConfig() {
		return API.get('/config');
	}
};
