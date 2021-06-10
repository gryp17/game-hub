<template>
	<div class="form-input">
		<FormFloatingLabel :visible="showLabel">
			{{ placeholder }}
		</FormFloatingLabel>
		<div class="input-group">
			<!--
				v-on automatically propagates all events up to the parent
				so the @focus and @keyup events can be set there.
				It doesn't work together with v-model that's why the @input event and :value prop need to be set manually
			-->
			<input
				v-if="tag === 'input'"
				:value="value"
				:class="['form-control', className, {dark}, {'has-error': error}]"
				:type="type"
				:name="name"
				:placeholder="placeholder"
				:disabled="disabled"
				v-on="{
					...$listeners,
					input: onInput,
					focus: onFocus,
					blur: onBlur
				}"
			/>
			<textarea
				v-if="tag === 'textarea'"
				:value="value"
				:class="['form-control', className, {dark, monospaced}, {'has-error': error}]"
				:name="name"
				:placeholder="placeholder"
				:rows="rows"
				:disabled="disabled"
				v-on="{
					...$listeners,
					input: onInput,
					focus: onFocus,
					blur: onBlur
				}"
			/>
		</div>

		<FormInputError>
			{{ error }}
		</FormInputError>
	</div>
</template>

<script>
	import FormFloatingLabel from '@/components/forms/FormFloatingLabel';
	import FormInputError from '@/components/forms/FormInputError';

	export default {
		components: {
			FormFloatingLabel,
			FormInputError
		},
		props: {
			dark: Boolean,
			floatingLabel: Boolean,
			tag: {
				type: String,
				default: 'input',
				validator(value) {
					return ['input', 'textarea'].includes(value);
				}
			},
			value: String,
			className: String,
			type: String,
			placeholder: String,
			rows: {
				type: Number,
				default: 3
			},
			disabled: {
				type: Boolean,
				default: false
			},
			monospaced: {
				type: Boolean,
				defalt: false
			},
			name: String,
			error: String
		},
		data() {
			return {
				focused: false
			};
		},
		computed: {
			showLabel() {
				return this.floatingLabel && this.focused && this.value;
			}
		},
		methods: {
			/**
			 * Propagates the "input" event back to the parent (needed because of v-model)
			 * @param {Object} e
			*/
			onInput(e) {
				this.$emit('input', e.target.value);
			},
			/**
			 * Intercepts the focus event and updates the focused parameter
			 * @param {Object} e
			 */
			onFocus(e) {
				this.focused = true;

				//call the passed focus event (if provided)
				if (this.$listeners.focus) {
					this.$listeners.focus(e);
				}
			},
			/**
			 * Intercepts the blur event and updates the focused parameter
			 * @param {Object} e
			 */
			onBlur(e) {
				this.focused = false;

				//call the passed blur event (if provided)
				if (this.$listeners.blur) {
					this.$listeners.blur(e);
				}
			}
		}
	};
</script>

<style scoped lang="scss">
	.form-input{
		position: relative;
		margin-bottom: 18px;

		.form-control {
			display: block;
			width: 100%;
			padding: 10px;
			border-radius: 0px;
			background-color: $white;
			border: solid 1px $gray-lightest;
			font-size: inherit;
			font-family: $font-family;
			box-sizing: border-box;
			resize: none;
			transition: all 300ms;

			&.dark {
				background-color: $gray;
				border-color: $gray-very-light;
				color: $white;
			}

			&:focus {
				box-shadow: none;
				border-color: $purple;
			}

			&.monospaced {
				font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
				font-size: 13px;
			}

			&.has-error {
				border-color: $red;
			}

			&:disabled {
				cursor: not-allowed;
				opacity: 0.7;
			}
		}

		textarea {
			&.form-control {
				padding: 10px;
			}
		}
	}
</style>
