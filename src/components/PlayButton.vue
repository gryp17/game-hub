<template>
	<div class="play-button">
		<template v-if="active">
			<img class="loading-image" src="@/assets/img/loading-circle.svg" />
			<FormButton
				@click="stop"
			>
				<span class="action">
					Stop
				</span>
				<span class="action long">
					Stop matchmaking
				</span>
			</FormButton>
		</template>
		<template v-else>
			<FormButton
				:disabled="disabled"
				@click="play"
			>
				<span class="action">
					{{ playButtonText }}
				</span>
				<span class="action long">
					{{ playButtonTextLong }}
				</span>
			</FormButton>

			<DropdownMenu
				direction="right"
			>
				<template v-slot:button>
					<FormButton class="arrow-btn">
						<i class="fas fa-angle-down"></i>
					</FormButton>
				</template>
				<template v-slot:items>
					<div
						v-for="game in enabledGames"
						:key="game.value"
						@click="selectGame(game)"
					>
						<i :class="game.icon"></i>
						{{ game.label }}
					</div>
				</template>
			</DropdownMenu>
		</template>
	</div>
</template>

<script>
	import DropdownMenu from '@/components/DropdownMenu';

	export default {
		components: {
			DropdownMenu
		},
		props: {
			active: {
				type: Boolean,
				default: false
			},
			disabled: {
				type: Boolean,
				default: false
			},
			availableGames: Array
		},
		data() {
			return {
				selectedGame: null
			};
		},
		computed: {
			/**
			 * Returns the list of available games and adds the "any" option
			 * @returns {Array}
			 */
			enabledGames() {
				return [
					//add the "any" option to the list
					this.$options.filters.gamesMap('any'),
					...this.availableGames
				];
			},
			/**
			 * Returns the selected game name
			 * @returns {String}
			 */
			selectedGameName() {
				return this.selectedGame.value === 'any' ? null : this.selectedGame.label;
			},
			/**
			 * Returns the short version of the play button text
			 * @returns {String}
			 */
			playButtonText() {
				return this.selectedGameName ? this.selectedGameName : 'Play';
			},
			/**
			 * Returns the long version of the play button text
			 * @returns {String}
			 */
			playButtonTextLong() {
				return this.selectedGameName ? `Play ${this.selectedGameName}` : 'Play';
			}
		},
		/**
		 * Selects the first available game by default
		 */
		created() {
			this.selectedGame = this.enabledGames[0];
		},
		methods: {
			/**
			 * Sets the selected game
			 * @param {Object} game
			 */
			selectGame(game) {
				this.selectedGame = game;
			},
			/**
			 * Emits the stop event
			 */
			stop() {
				this.$emit('stop');
			},
			/**
			 * Emits the play event with the selected game
			 */
			play() {
				this.$emit('play', this.selectedGame.value);
			}
		}
	};
</script>

<style scoped lang="scss">
	.play-button {
		display: inline-flex;

		.loading-image {
			width: 35px;
			margin-right: 10px;
		}

		.action {
			display: none;

			&.long {
				display: inline;
			}
		}

		.arrow-btn {
			padding: 10px 5px;
			margin-left: 1px;

			svg {
				margin: 0;
			}
		}

		.dropdown-menu {
			::v-deep .actions {
				margin-top: 0px;

				&:before {
					display: none;
				}
			}
		}

		@media (max-width: $small) {
			> .form-button {
				padding: 10px;
			}

			.action {
				display: inline;

				&.long {
					display: none;
				}
			}
		}
	}
</style>
