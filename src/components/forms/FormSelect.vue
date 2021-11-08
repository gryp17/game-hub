<template>
	<div :class="['form-select', { capitalize }]">
		<div v-if="label" class="form-select-label">
			{{ label }}
		</div>
		<select
			:value="value"
			@input="$emit('input', $event.target.value)"
		>
			<option v-for="option in selectOptions" :value="option.value" :key="option.value">
				{{ option.label }}
			</option>
		</select>
	</div>
</template>

<script>
	import _ from 'lodash';

	export default {
		props: {
			options: {
				type: Array,
				required: true,
				validator(options) {
					//array of strings/numbers
					const isValidArray = options.every((item) => {
						return _.isString(item) || _.isNumber(item);
					});

					//array of objects with value and label properties
					const isValidObject = options.every((item) => {
						return _.isObject(item) && _.has(item, 'value') && _.has(item, 'label');
					});

					return isValidArray || isValidObject;
				}
			},
			value: {
				type: [String, Number],
				required: true
			},
			label: String,
			capitalize: {
				type: Boolean,
				default: false
			}
		},
		computed: {
			/**
			 * Returns the select options in a unified format
			 * @returns {Array}
			 */
			selectOptions() {
				return this.options.map((item) => {
					if (_.isObject(item)) {
						return item;
					}

					return {
						value: item,
						label: item
					};
				}).map((option) => {
					//need to use javascript to capitalize the select options on firefox
					if (this.capitalize) {
						option.label = _.capitalize(option.label);
					}

					return option;
				});
			}
		}
	};
</script>

<style scoped lang="scss">
	.form-select {
		.form-select-label {
			margin-bottom: 5px;
			font-size: 14px;
			font-weight: bold;
		}

		select {
			display: block;
			width: 100%;
			padding: 10px;
			background-color: $white;
			border: solid 1px $gray-lightest;
			border-radius: 0px;
			font-size: 16px;

			&:focus {
				box-shadow: none;
				border-color: $purple;
			}
		}

		&.capitalize {
			select {
				text-transform: capitalize;
			}
		}
	}
</style>
