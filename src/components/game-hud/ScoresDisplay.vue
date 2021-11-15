<template>
	<div class="scores-display">
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
</template>

<script>
	export default {
		props: {
			scores: Array
		}
	};
</script>

<style scoped lang="scss">
	.scores-display {
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
</style>
