<template>
	<div
		:class="['game-history-item', { winner: isWinner, ragequit: isRagequit }]"
		:title="title"
	>
		<div class="inner-wrapper">
			<DynamicIcon
				className="game-type-icon-wrapper"
				:icon="gameType.icon"
				:title="gameType.label"
			/>

			<DynamicIcon
				className="result-icon-wrapper"
				type="block"
				:icon="icon"
				:title="title"
			/>

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

		<div class="game-footer">
			<span
				class="footer-item"
				:title="dateAndTime"
			>
				<i class="far fa-calendar-alt"></i>
				{{ date }}
			</span>

			<span
				class="footer-item"
				title="Duration"
			>
				<i class="far fa-clock"></i>
				{{ duration }}
			</span>
		</div>
	</div>
</template>

<script>
	import moment from 'moment';
	import UserAvatar from '@/components/UserAvatar';
	import DynamicIcon from '@/components/DynamicIcon';

	export default {
		components: {
			UserAvatar,
			DynamicIcon
		},
		props: {
			game: Object,
			userProfile: Object
		},
		computed: {
			/**
			 * Indicates whether the user is the game's winner
			 * @returns {Boolean}
			 */
			isWinner() {
				return this.game.winner === this.userProfile.id;
			},
			/**
			 * Indicates whether the opponent has ragequit
			 * @returns {Boolean}
			 */
			isRagequit() {
				return !this.isWinner && this.game.ragequit;
			},
			/**
			 * Returns the item's title
			 * @returns {String}
			 */
			title() {
				if (this.isWinner) {
					return 'Win';
				}

				if (this.isRagequit) {
					return 'Ragequit';
				}

				return 'Loss';
			},
			/**
			 * Returns the game information
			 * @returns {Object}
			 */
			gameType() {
				return this.$options.filters.gamesMap(this.game.type);
			},
			/**
			 * Returns the correct icon depending on the game result
			 * @returns {String}
			 */
			icon() {
				if (this.isWinner) {
					return 'fas fa-trophy color-yellow';
				}

				if (this.isRagequit) {
					return 'fas fa-poo color-brown';
				}

				return 'fas fa-meh color-yellow';
			},
			/**
			 * Returns the game score/result
			 * @returns {Array}
			 */
			scores() {
				const scores = Object.values(this.game.result);

				//sort the users by showing the current user first
				scores.sort((a, b) => {
					if (a.user.username === this.userProfile.username) {
						return 1;
					}

					return 0;
				});

				return scores;
			},
			/**
			 * Returns the game finished date
			 * @returns {String}
			 */
			date() {
				return moment(this.game.updatedAt).format('YYYY-MM-DD');
			},
			/**
			 * Returns the full game finished date and time
			 * @returns {String}
			 */
			dateAndTime() {
				return moment(this.game.updatedAt).format('YYYY-MM-DD HH:mm:ss');
			},
			/**
			 * Returns the game duration in seconds
			 * @returns {Number}
			 */
			durationInSeconds() {
				return moment(this.game.updatedAt).diff(moment(this.game.createdAt), 'seconds');
			},
			/**
			 * Returns the formatted game duration
			 * @returns {String}
			 */
			duration() {
				if (this.durationInSeconds > 60) {
					const durationInMinutes = Math.floor(this.durationInSeconds / 60);
					const leftoverSeconds = this.durationInSeconds % 60;
					return `${durationInMinutes} minute(s) and ${leftoverSeconds} second(s)`;
				}

				return `${this.durationInSeconds} seconds`;
			}
		}
	};
</script>

<style lang="scss">
	$color-loss: $red;
	$color-win: $green;
	$color-ragequit: $pink;

	.game-history-item {
		position: relative;
		margin-bottom: 8px;
		border-radius: 5px;
		box-shadow: 1px 3px 3px $gray-very-light;
		border: solid 10px $color-loss;
		border-bottom-width: 5px;

		&:after {
			content: '';
			position: absolute;
			left: 0px;
			top: 0px;
			border-style: solid;
			border-width: 40px 40px 0 0;
			border-color: $color-loss transparent transparent transparent;
		}

		&.winner {
			border-color: $color-win;

			&:after {
				border-top-color: $color-win;
			}

			.game-footer {
				background-color: $color-win;
			}
		}

		&.ragequit {
			border-color: $color-ragequit;

			&:after {
				border-top-color: $color-ragequit;
			}

			.game-footer {
				background-color: $color-ragequit;
			}
		}

		.inner-wrapper {
			padding: 5px 10px 10px 10px;
		}

		.players-wrapper {
			display: flex;

			.player-item {
				flex: 1;
				text-align: center;
				overflow-x: hidden;

				&:first-child {
					order: 2;
				}

				.username-wrapper {
					font-size: 20px;

					.username {
						padding-bottom: 5px;
						border-bottom: solid 2px $gray-lightest;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						cursor: pointer;

						.user-avatar {
							margin-right: 5px;
						}
					}
				}

				.score {
					margin-top: 5px;
					font-size: 18px;
				}
			}

			.vs {
				display: flex;
				padding: 0px 20px;
				align-items: center;
				justify-content: center;
				font-size: 18px;
			}
		}

		.game-type-icon-wrapper {
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

		.game-footer {
			display: flex;
			justify-content: space-between;
			padding-top: 5px;
			color: $white;
			background-color: $color-loss;
			font-size: 15px;

			.footer-item {
				display: flex;
				align-items: center;

				svg {
					margin-right: 4px;
				}
			}
		}
	}
</style>
