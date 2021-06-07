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
	import { mapState } from 'vuex';
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
			}
		},
		data() {
			return {
				iconsMap: {
					pong: 'fas fa-table-tennis'
				},
				selectedGame: null
			};
		},
		computed: {
			...mapState('config', [
				'availableGames'
			]),
			enabledGames() {
				const games = [
					{
						label: 'Any game',
						value: 'any',
						icon: 'fas fa-dice'
					}
				];

				Object.values(this.availableGames).forEach(({ label, value }) => {
					const game = {
						label,
						value,
						icon: this.iconsMap[value]
					};

					games.push(game);
				});

				return games;
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
			border-left: solid 1px $gray;
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
