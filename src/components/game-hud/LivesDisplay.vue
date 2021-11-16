<template>
	<div class="lives-display">
		<div
			v-for="(item, userIndex) in lives"
			:key="item.id"
			class="player-info"
		>
			<div class="username">
				{{ item.username }}
			</div>
			<div class="lives">
				<template v-for="index in item.lives">
					<img
						v-if="userIndex === 0"
						:key="index"
						src="@/assets/img/life-icon-green.png"
					/>
					<img
						v-else
						:key="index"
						src="@/assets/img/life-icon-yellow.png"
					/>
				</template>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			lives: Array
		}
	};
</script>

<style scoped lang="scss">
	.lives-display {
		display: flex;
		padding: 15px;
		text-shadow: 1px 1px 1px $gray;

		.player-info {
			.username {
				font-size: 18px;
			}

			.lives {
				margin-top: 5px;

				img {
					display: inline-block;
					margin-right: 6px;
					width: 22px;
				}
			}

			+ .player-info {
				margin-left: 25px;
			}
		}

		@media (max-width: $small) {
			.player-info {
				.username {
					font-size: 16px;
				}
			}
		}

		@media (max-width: $extra-small) {
			display: none;
		}
	}
</style>
