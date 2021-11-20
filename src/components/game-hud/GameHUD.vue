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
			<FormButton
				transparent
				:active="sound"
				@click="setSoundPreference('sound', !sound)"
			>
				<i class="fas fa-volume-up"></i>
			</FormButton>

			<FormButton
				transparent
				:active="music"
				@click="setSoundPreference('music', !music)"
			>
				<i class="fas fa-music"></i>
			</FormButton>
		</div>
	</div>
</template>

<script>
	import ScoresDisplay from '@/components/game-hud/ScoresDisplay';
	import LivesDisplay from '@/components/game-hud/LivesDisplay';

	export default {
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
		components: {
			ScoresDisplay,
			LivesDisplay
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
			right: 0px;
			top: 0px;
			padding: 15px;

			.form-button {
				padding: 10px;
				border-radius: 100%;
				border: solid 2px lighten($purple, 10%);
				background-color: $white;
				opacity: 0.6;

				svg {
					margin-right: 0px;
				}

				+ .form-button {
					margin-left: 10px;
				}

				&.active, &:hover {
					border-color: $purple;
					opacity: 1;
				}
			}
		}

		@media (max-width: $small) {
			.audio-controls-wrapper {
				.form-button {
					padding: 5px;
					width: 35px;
					height: 35px;

					svg {
						width: 16px;
						height: 16px;
					}
				}
			}
		}
	}
</style>
