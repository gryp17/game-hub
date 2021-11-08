<template>
	<div class="game-settings-summary">
		<div v-for="(value, label) in settings" :key="label" class="game-settings-item">
			<div class="label">
				{{ label | settingsLabelsMap(game) }}:
			</div>
			<div :class="['value', { default: value === 'default'}]">
				{{ value }}
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			game: {
				type: String,
				required: true
			},
			settings: {
				type: Object,
				required: true
			}
		}
	};
</script>

<style scoped lang="scss">
	.game-settings-summary {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		margin-top: 15px;
		padding-top: 15px;
		background-color: $gray-almost-white;
		border-radius: 5px;

		.game-settings-item {
			width: 48%;
			margin-bottom: 15px;
			text-align: center;

			.label {
				font-size: 14px;
				font-weight: bold;
			}

			.value {
				margin-top: 5px;
				color: $red;
				text-transform: capitalize;

				&.default {
					color: $text-color-dark;
				}
			}
		}
	}
</style>
