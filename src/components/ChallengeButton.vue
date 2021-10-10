<template>
	<div class="challenge-button">
		<FormButton
			:disabled="disabled"
			@click="challenge"
		>
			{{ playButtonText }}
		</FormButton>

		<DropdownMenu
			direction="right"
		>
			<template v-slot:button>
				<FormButton
					:disabled="disabled"
					class="arrow-btn"
				>
					<i class="fas fa-angle-down"></i>
				</FormButton>
			</template>
			<template v-slot:items>
				<div
					v-for="game in availableGames"
					:key="game.value"
					@click="selectGame(game)"
				>
					<i :class="game.icon"></i>
					{{ game.label }}
				</div>
			</template>
		</DropdownMenu>
	</div>
</template>

<script>
	import { mapGetters } from 'vuex';
	import DropdownMenu from '@/components/DropdownMenu';

	export default {
		components: {
			DropdownMenu
		},
		props: {
			disabled: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				selectedGame: null
			};
		},
		computed: {
			...mapGetters('config', [
				'availableGames'
			]),
			playButtonText() {
				return this.selectedGame.value === 'any' ? 'Play' : `Play ${this.selectedGame.label}`;
			}
		},
		created() {
			this.selectedGame = this.availableGames[0];
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
			 * Emits the challenge event with the selected game
			 */
			challenge() {
				this.$emit('challenge', this.selectedGame.value);
			}
		}
	};
</script>

<style scoped lang="scss">
	.challenge-button {
		display: inline-flex;

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
