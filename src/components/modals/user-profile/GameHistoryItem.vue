<template>
	<div
		:class="['game-history-item', { winner: isWinner, ragequit: isRagequit }]"
		:title="title"
	>
		<div class="icon-wrapper">
			<i
				:class="icon"
				:title="title"
			></i>
		</div>

		<div class="players-wrapper">
			<div
				v-for="{ user, score } in scores"
				:key="user.id"
				class="player-item"
			>
				<div class="username">
					<UserAvatar
						:avatar="user.avatarLink"
						:title="user.username"
					/>
					<span :title="user.username">
						{{ user.username }}
					</span>
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
	.game-history-item {
		margin-bottom: 8px;
		padding: 5px 10px 10px 10px;
		border-radius: 5px;
		box-shadow: 1px 3px 3px $gray-very-light;
		border: solid 10px lighten($red, 20%);

		&.winner {
			border-color: lighten($green, 20%);
		}

		&.ragequit {
			border-color: lighten($pink, 10%);
		}

		.players-wrapper {
			display: flex;

			.player-item {
				flex: 1;
				text-align: center;

				&:first-child {
					order: 2;
				}

				.username {
					font-size: 20px;
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

		.icon-wrapper {
			padding: 5px;
			text-align: center;
			font-size: 26px;
		}
	}
</style>
