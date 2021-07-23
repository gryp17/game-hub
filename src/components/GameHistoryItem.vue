<template>
	<div :class="['game-history-item', { winner: isWinner, ragequit: isRagequit }]">
		<!-- TODO: add icons depending on the type of result (maybe use the same icons from the game over screen) -->

		{{ game.id }} - {{ game.updatedAt }}
		<br/>
		{{ game.data }}
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
			}
		}
	};
</script>

<style lang="scss">
	.game-history-item {
		margin-bottom: 5px;
		padding: 10px;
		background-color: lighten($yellow, 30%);

		&.winner {
			background-color: lighten($green, 20%);
		}

		&.ragequit {
			background-color: lighten($red, 10%);
		}
	}
</style>
