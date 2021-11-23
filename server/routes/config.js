import _ from 'lodash';
import express from 'express';
import { sendResponse } from '../services/utils';
import { userStatuses, gameCodes, socketEvents, games, defaultControls, validInputKeyCodes } from '../config';

const router = express.Router();

/**
 * Returns the app config
 */
router.get('/', (req, res) => {
	//format the configurable settings by returning only the options keys/labels
	const configurableSettings = {};

	_.forOwn(games, (data, game) => {
		const settings = {};

		_.forOwn(data.configurableSettings, (options, setting) => {
			settings[setting] = Object.keys(options);
		});

		configurableSettings[game] = settings;
	});

	sendResponse(res, {
		userStatuses,
		availableGames: gameCodes,
		socketEvents,
		configurableSettings,
		defaultControls,
		validInputKeyCodes
	});
});

export default router;
