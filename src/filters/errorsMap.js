/**
 * Maps the error code to it's string value
 * @param {String} errorCode
 * @returns {String}
 */
export default (errorCode) => {
	const errors = {
		required: 'This field is required',
		invalid_boolean: 'Invalid boolean value',
		invalid_integer: 'Invalid number',
		invalid_email: 'Invalid email',
		fields_dont_match: 'The fields don\'t match',
		already_in_use: 'Already in use',
		wrong_password: 'Wrong password',
		// api errors
		invalid_authentication_token: 'Invalid authentication token',
		invalid_user_id: 'Invalid user id'
	};

	if (!errors[errorCode]) {
		//strong_password_length_\d+
		if (/strong_password_length_(\d+)/.exec(errorCode)) {
			const results = /strong_password_length_(\d+)/.exec(errorCode);
			return `Must contain at least ${results[1]} characters, a digit and a letter`;
		}

		//exceeds_characters_\d+
		if (/exceeds_characters_(\d+)/.exec(errorCode)) {
			const results = /exceeds_characters_(\d+)/.exec(errorCode);
			return `Must not exceed ${results[1]} characters`;
		}

		//below_characters_\d+
		if (/below_characters_(\d+)/.exec(errorCode)) {
			const results = /below_characters_(\d+)/.exec(errorCode);
			return `Must be at least ${results[1]} characters`;
		}

		//exceeds_file_size_\d+
		if (/exceeds_max_file_size_(\d+)/.exec(errorCode)) {
			const results = /exceeds_max_file_size_(\d+)/.exec(errorCode);
			return `Must not exceed ${results[1] / 1000000}MB`;
		}

		//invalid_file_extension_[...]
		if (/invalid_file_extension_\[(.+?)\]/.exec(errorCode)) {
			const results = /invalid_file_extension_\[(.+?)\]/.exec(errorCode);
			return `Allowed file extensions: ${results[1].split(',').join(', ')}`;
		}

		//not_in_list_[...]
		if (/not_in_list_\[(.+?)\]/.exec(errorCode)) {
			const results = /not_in_list_\[(.+?)\]/.exec(errorCode);
			return `Allowed values: ${results[1].split(',').join(', ')}`;
		}
	}

	return errors[errorCode] || errorCode;
};
