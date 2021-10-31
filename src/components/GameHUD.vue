<template>
	<div class="game-hud">
		<div class="scores-wrapper">
			<div
				v-for="item in scores"
				:key="item.id"
				class="player-info"
			>
				<div class="username">
					{{ item.username }}
				</div>
				<div class="score">
					{{ item.score }}
				</div>
			</div>
		</div>

		<div class="audio-controls-wrapper">
			<FormButton
				transparent
				:active="sound"
				@click="toggleAudio"
			>
				<i class="fas fa-volume-up"></i>
			</FormButton>

			<FormButton
				transparent
				:active="music"
				@click="toggleMusic"
			>
				<i class="fas fa-music"></i>
			</FormButton>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			scores: Array,
			sound: {
				type: Boolean,
				default: false
			},
			music: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			toggleAudio() {
				console.log('toggle audio');

				//give focus back to the canvas after clicking any of the buttons
				$('.canvas').focus();
			},
			toggleMusic() {
				console.log('toggle music');

				//give focus back to the canvas after clicking any of the buttons
				$('.canvas').focus();
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

		.scores-wrapper {
			display: flex;
			text-shadow: 1px 1px 1px $gray;

			.player-info {
				flex: 1;
				padding: 15px 20px;
				text-align: left;

				.username {
					font-size: 32px;
				}

				.score {
					margin-top: 5px;
					font-size: 28px;
				}

				&:first-child {
					text-align: right;
				}
			}
		}

		.audio-controls-wrapper {
			position: absolute;
			right: 0px;
			top: 0px;
			padding: 15px;

			.form-button {
				padding: 10px;
				border-radius: 100%;
				border: solid 2px lighten($purple, 10%);
				background-color: rgba($gray-lightest, 1);
				opacity: 0.6;

				+ .form-button {
					margin-left: 10px;
				}

				&.active, &:hover {
					border-color: $purple;
					opacity: 1;
				}
			}
		}
	}
</style>
