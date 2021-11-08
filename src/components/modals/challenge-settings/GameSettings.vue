<template>
	<div class="game-settings">
		<FormSelect
			v-for="(options, property) in configurableSettings[game]"
			:key="property"
			v-model="settings[game][property]"
			:label="$options.filters.settingsLabelsMap(property, game)"
			:options="options"
			capitalize
		/>
	</div>
</template>

<script>
	import { mapState } from 'vuex';

	export default {
		props: {
			game: {
				type: String,
				required: true
			},
			value: Object
		},
		data() {
			return {
				settings: {
					pong: {
						gameLength: 'default',
						ballSpeed: 'default',
						ballSize: 'default',
						paddleSize: 'default'
					},
					volley: {
						gameLength: 'default',
						background: 'default',
						netHeight: 'default',
						hitLimit: 'default'
					}
				}
			};
		},
		computed: {
			...mapState('config', [
				'configurableSettings'
			])
		},
		watch: {
			settings: {
				/**
				 * Watch the settings and emit the "input" event when they change
				 */
				handler() {
					this.updateValue();
				},
				deep: true
			}
		},
		/**
		 * Emits the "input" event when the component loads
		 */
		created() {
			this.updateValue();
		},
		methods: {
			/**
			 * Emits the "input" event with the current settings values
			 */
			updateValue() {
				this.$emit('input', this.settings[this.game]);
			}
		}
	};
</script>

<style scoped lang="scss">
	.game-settings {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		margin-bottom: 10px;
		padding: 15px;
		background-color: $gray-almost-white;
		border-radius: 5px;

		.form-select {
			width: 48%;
			margin-bottom: 15px;
		}
	}
</style>
