<template>
	<div
		:class="['game-history-item', { winner: isWinner, ragequit: isRagequit }]"
		:title="title"
	>
		<i
			:class="[gameType.icon, 'game-type-icon']"
			:title="gameType.label"
		/>

		<div class="result-icon-wrapper">
			<i
				:class="icon"
				:title="title"
			/>
		</div>

		<div class="players-wrapper">
			<div
				v-for="{ user, score } in scores"
				:key="user.id"
				class="player-item"
			>
				<div class="username-wrapper">
					<div
						class="username"
						@click="$emit('open-profile', user.id)"
					>
						<UserAvatar
							:avatar="user.avatarLink"
							:title="user.username"
						/>
						<span
							:title="user.username"
						>
							{{ user.username }}
						</span>
					</div>
				</div>
				<div class="score">
					{{ score }}
				</div>
			</div>

			<div class="vs">
				VS
			</div>
		</div>
	</div>
</template>

<script>
	import UserAvatar from '@/components/UserAvatar';

	export default {
		components: {
			UserAvatar
		},
		props: {
			game: Object,
			userProfile: Object
		},
		computed: {
			isWinner() {
				return this.game.winner === this.userProfile.id;
			},
			isRagequit() {
				return !this.isWinner && this.game.ragequit;
			},
			title() {
				if (this.isWinner) {
					return 'Win';
				}

				if (this.isRagequit) {
					return 'Ragequit';
				}

				return 'Loss';
			},
			gameType() {
				return this.$options.filters.gamesMap(this.game.type);
			},
			icon() {
				if (this.isWinner) {
					return 'fas fa-trophy color-yellow';
				}

				if (this.isRagequit) {
					return 'fas fa-poo color-brown';
				}

				return 'fas fa-meh color-yellow';
			},
			scores() {
				const scores = Object.values(this.game.data.score);

				//sort the users by showing the current user first
				scores.sort((a, b) => {
					if (a.user.username === this.userProfile.username) {
						return 1;
					}

					return 0;
				});

				return scores;
			}
		}
	};
</script>

<style lang="scss">
	$border-color-loss: lighten($red, 20%);
	$border-color-win: lighten($green, 20%);
	$border-color-ragequit: lighten($pink, 10%);

	.game-history-item {
		position: relative;
		margin-bottom: 8px;
		padding: 5px 10px 10px 10px;
		border-radius: 5px;
		box-shadow: 1px 3px 3px $gray-very-light;
		border: solid 10px $border-color-loss;

		&:after {
			content: '';
			position: absolute;
			left: 0px;
			top: 0px;
			border-style: solid;
			border-width: 40px 40px 0 0;
			border-color: $border-color-loss transparent transparent transparent;
		}

		&.winner {
			border-color: $border-color-win;

			&:after {
				border-top-color: $border-color-win;
			}
		}

		&.ragequit {
			border-color: $border-color-ragequit;

			&:after {
				border-top-color: $border-color-ragequit;
			}
		}

		.players-wrapper {
			display: flex;

			.player-item {
				flex: 1;
				text-align: center;

				&:first-child {
					order: 2;
				}

				.username-wrapper {
					font-size: 20px;

					.username {
						display: inline-block;
						cursor: pointer;
					}
				}

				.score {
					margin-top: 5px;
					font-size: 18px;
				}
			}

			.vs {
				display: flex;
				align-items: center;
				font-size: 18px;
			}
		}

		.game-type-icon {
			position: absolute;
			left: -3px;
			top: -3px;
			font-size: 20px;
			color: $white;
			z-index: 1;
		}

		.result-icon-wrapper {
			padding: 5px;
			text-align: center;
			font-size: 26px;
		}
	}
</style>
