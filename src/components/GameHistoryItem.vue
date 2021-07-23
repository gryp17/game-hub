<template>
	<div class="game-history-item">
		{{ game.id }}
		<br/>
		{{ game.data }}
	</div>
</template>

<script>
	export default {
		props: {
			game: Object
		}
	};
</script>

<style lang="scss">
	.game-history-item {
		margin-bottom: 5px;
		padding: 10px;
		background-color: $gray-light;
	}
</style>
