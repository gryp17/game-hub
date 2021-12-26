<template>
	<div class="game-hud">

		<LivesDisplay
			v-if="data.lives"
			:lives="data.lives"
		/>

		<ScoresDisplay
			v-if="data.scores"
			:scores="data.scores"
		/>

		<div class="audio-controls-wrapper">
			<GameHUDButton
				title="Toggle sound effects"
				:active="sound"
				@click="setSoundPreference('sound', !sound)"
			>
				<i class="fas fa-volume-up"></i>
			</GameHUDButton>

			<GameHUDButton
				title="Toggle music"
				:active="music"
				@click="setSoundPreference('music', !music)"
			>
				<i class="fas fa-music"></i>
			</GameHUDButton>
		</div>
	</div>
</template>

<script>
	import ScoresDisplay from '@/components/game-hud/ScoresDisplay';
	import LivesDisplay from '@/components/game-hud/LivesDisplay';
	import GameHUDButton from '@/components/game-hud/GameHUDButton';

	export default {
		components: {
			ScoresDisplay,
			LivesDisplay,
			GameHUDButton
		},
		props: {
			data: Object,
			sound: {
				type: Boolean,
				default: false
			},
			music: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				loading: false
			};
		},
		methods: {
			/**
			 * Emits the "set-sound" or "set-music" events with the toggled preference value
			 * @param {String} preference
			 * @param {Boolean} value
			 */
			async setSoundPreference(preference, value) {
				if (this.loading) {
					return;
				}

				//give focus back to the canvas after clicking any of the buttons
				$('.canvas').focus();

				this.loading = true;
				const action = `set-${preference}`;
				await this.$listeners[action](value);
				this.loading = false;
			}
		}
	};
</script>

<style scoped lang="scss">
	.game-hud {
		position: absolute;
		width: 100%;
		height: 100%;
		user-select: none;
		z-index: 1;

		.audio-controls-wrapper {
			position: absolute;
			display: flex;
			right: 0px;
			top: 0px;
			padding: 15px;
		}

		@media (max-width: $small) {
			.audio-controls-wrapper {
				.game-hud-button {
					width: 35px;
					height: 35px;

					svg {
						width: 13px;
						height: 16px;
					}
				}
			}
		}
	}
</style>
