import _ from 'lodash';
import express from 'express';
import inspector from 'schema-inspector';
import { Settings } from '../models';
import { sendResponse, sendApiError, sendError } from '../services/utils';
import { isLoggedIn } from '../middleware/authentication';
import { validate } from '../middleware/validator';
import { errorCodes, defaultControls, validInputKeyCodes } from '../config';

const router = express.Router();

const rules = {
	updateSettings: {
		controls: 'optional',
		sound: ['required', 'boolean'],
		music: ['required', 'boolean']
	}
};

/**
 * Validates and sanitizes the controls object
 * @param {Object} controls
 * @returns {Object}
 */
function validateControlsSchema(controls) {
	const controlsObject = {
		...controls
	};

	const validationRules = {
		type: 'object',
		strict: true,
		properties: {
			//to be generated using the default controls keys
			//up, down, left, right...
		}
	};

	const inputValidationRules = {
		type: 'object',
		strict: true,
		properties: {
			keys: {
				type: 'array',
				exactLength: 2,
				items: {
					type: ['number', 'null']
				}
			}
		}
	};

	//for each defaultControls input type generate the same validation rules
	Object.keys(defaultControls).forEach((key) => {
		validationRules.properties[key] = inputValidationRules;
	});

	//sanitize the controlsObject removing any unnecessary data
	inspector.sanitize(validationRules, controlsObject);

	const result = inspector.validate(validationRules, controlsObject);

	return {
		valid: result.valid,
		data: controlsObject
	};
}

/**
 * Validates the individual input keys by making sure they are in the list of valid key codes
 * @param {Object} controls
 * @returns {Object}
 */
function validateInputKeys(controls) {
	const controlsObject = {
		...controls
	};

	const validCodes = {
		...validInputKeyCodes
	};

	//loop through all keys and check if they are in the valid codes list
	//if they are not just set them as null
	_.forOwn(controlsObject, (data) => {
		data.keys = data.keys.map((key) => {
			if (validCodes[key]) {
				//remove the code from the validCodes list
				//this is a clever/lazy way to make sure the same code won't be used for another input
				delete validCodes[key];

				return key;
			}

			return null;
		});
	});

	return controlsObject;
}

/**
 * Returns the user's game settings
 */
router.get('/', isLoggedIn, async (req, res) => {
	try {
		const settingsRecord = await Settings.findOne({
			where: {
				userId: req.session.user.id
			}
		});

		sendResponse(res, settingsRecord);
	} catch (err) {
		sendApiError(res, err);
	}
});

/**
 * Updates the user's game settings
 */
router.put('/', isLoggedIn, validate(rules.updateSettings), async (req, res) => {
	const { controls, sound, music } = req.body;

	const updatedFields = {
		sound,
		music
	};

	//the controls object is optional so do the controls validations only if the controls object was provided
	if (controls) {
		//validate and sanitize the controls object schema
		const result = validateControlsSchema(controls);

		if (!result.valid) {
			return sendError(res, {
				controls: errorCodes.invalidSchema
			});
		}

		//validate the input keys (make sure they are in the valid keys list)
		const validControls = validateInputKeys(result.data);

		updatedFields.controls = validControls;
	}

	try {
		const settingsInstance = await Settings.findOne({
			where: {
				userId: req.session.user.id
			}
		});

		settingsInstance.set(updatedFields);

		await settingsInstance.save();

		sendResponse(res, settingsInstance);
	} catch (err) {
		sendApiError(res, err);
	}
});

export default router;
