<template>
	<FormInput
		class="control-input"
		:value="value | keyCodesMap"
		@keydown="onKeyDown"
		@keyup="onKeyUp"
	/>
</template>

<script>
	export default {
		props: {
			value: Number,
			validInputKeyCodes: {
				type: Object,
				required: true
			}
		},
		methods: {
			/**
			 * Handles the controls inputs keydown event
			 * @param {Object} e
			 */
			onKeyDown(e) {
				e.preventDefault();
			},
			/**
			 * Handles the controls inputs keyup event
			 * @param {Object} e
			 */
			onKeyUp(e) {
				e.preventDefault();

				//update the input key code (the key code gets mapped to it's name in the markup)
				const keyCode = (e.which) ? e.which : e.keyCode;

				if (this.keyIsValid(keyCode)) {
					this.$emit('input', keyCode);
				}

				//on backspace clear the input
				if (keyCode === 8) {
					this.$emit('input', null);
				}
			},
			/**
			 * Checks if the key code is in the list of valid input key codes
			 * @param {Number} keyCode
			 * @returns {Boolean}
			 */
			keyIsValid(keyCode) {
				return !!this.validInputKeyCodes[keyCode];
			}
		}
	};
</script>

<style scoped lang="scss">
	.control-input {
		margin-bottom: 0px;

		::v-deep .form-control {
			text-transform: uppercase;
		}
	}
</style>
