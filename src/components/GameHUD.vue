<template>
	<div class="game-hud">

		<div v-if="lives" class="lives-wrapper">
			<div
				v-for="(item, userIndex) in lives"
				:key="item.id"
				class="player-info"
			>
				<div class="username">
					{{ item.username }}
				</div>
				<div class="lives">
					<template v-for="index in item.lives">
						<img
							v-if="userIndex === 0"
							:key="index"
							src="@/assets/img/life-icon-green.png"
						/>
						<img
							v-else
							:key="index"
							src="@/assets/img/life-icon-yellow.png"
						/>
					</template>
				</div>
			</div>
		</div>
		<div v-else class="scores-wrapper">
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
	export default {
		props: {
			scores: Array,
			lives: Array,
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

		.lives-wrapper {
			padding: 15px;
			text-shadow: 1px 1px 1px $gray;

			.player-info {
				.username {
					font-size: 18px;
				}

				.lives {
					margin-top: 5px;

					img {
						display: inline-block;
						margin-right: 6px;
						width: 25px;
					}
				}

				+ .player-info {
					margin-top: 5px;
				}
			}
		}

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
				background-color: $white;
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
