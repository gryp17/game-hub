<template>
	<div
		:class="['game-history-item', { winner: isWinner, ragequit: isRagequit }]"
		:title="title"
	>
		<div class="icon-wrapper">
			<i
				:class="[icon, 'result-icon']"
				:title="title"
			></i>
		</div>
		<div>
			{{ game.id }} - {{ game.updatedAt }}
			<br/>
			{{ game.data }}
		</div>
	</div>
</template>

<script>
	export default {
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
					return 'fas fa-trophy color-white';
				}

				if (this.isRagequit) {
					return 'fas fa-poo color-brown';
				}

				return 'fas fa-meh color-gray-light';
			}
		}
	};
</script>

<style lang="scss">
	.game-history-item {
		display: flex;
		margin-bottom: 8px;
		padding: 10px;
		border-radius: 5px;
		box-shadow: 1px 3px 3px $gray-very-light;
		background-color: lighten($red, 20%);

		&.winner {
			background-color: lighten($green, 20%);
		}

		&.ragequit {
			background-color: lighten($pink, 10%);
		}

		.icon-wrapper {
			display: flex;
			align-items: center;
			margin-right: 10px;

			.result-icon {
				font-size: 26px;
			}
		}
	}
</style>
