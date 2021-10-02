<template>
	<div class="game-settings-summary">
		<!-- pong settings -->
		<template v-if="game === 'pong'">
			<div v-for="setting in pongSettings" :key="setting.label" class="game-settings-item">
				<div class="label">
					{{ setting.label }}:
				</div>
				<div :class="['value', { default: setting.value === 'normal'}]">
					{{ setting.value }}
				</div>
			</div>
		</template>
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
		},
		computed: {
			pongSettings() {
				return [
					{
						label: 'Game length',
						value: this.settings.gameLength
					},
					{
						label: 'Paddle size',
						value: this.settings.paddleSize
					},
					{
						label: 'Ball speed',
						value: this.settings.ballSpeed
					},
					{
						label: 'Ball size',
						value: this.settings.ballSize
					}
				];
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
				color: $red;

				&.default {
					color: $text-color-dark;
				}
			}
		}
	}
</style>
