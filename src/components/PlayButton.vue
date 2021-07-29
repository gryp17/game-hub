<template>
	<div class="play-button">
		<template v-if="active">
			<img class="loading-image" src="@/assets/img/loading-circle.svg" />
			<FormButton
				@click="stop"
			>
				Stop matchmaking
			</FormButton>
		</template>
		<template v-else>
			<FormButton
				:disabled="disabled"
				@click="play"
			>
				{{ playButtonText }}
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
			enabledGames() {
				return [
					//add the "any" option to the list
					this.$options.filters.gamesMap('any'),
					...this.availableGames
				];
			},
			playButtonText() {
				return this.selectedGame.value === 'any' ? 'Play' : `Play ${this.selectedGame.label}`;
			}
		},
		created() {
			this.selectedGame = this.enabledGames[0];
		},
		methods: {
			selectGame(game) {
				this.selectedGame = game;
			},
			stop() {
				this.$emit('stop');
			},
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
	}
</style>
