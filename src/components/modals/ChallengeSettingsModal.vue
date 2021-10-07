<template>
	<div class="challenge-settings-modal">
		<modal
			:adaptive="true"
			:width="'100%'"
			:maxWidth="520"
			:height="'auto'"
			:clickToClose="canCloseModal"
			name="challenge-settings-modal"
			@before-open="onBeforeOpen"
		>
			<div class="header">
				Game challenge

				<FormButton
					transparent
					class="close-btn"
					@click="onHeaderCloseClick"
				>
					<i class="fas fa-times"></i>
				</FormButton>
			</div>
			<div v-if="user" class="content">
				<div v-show="!challengeSent">
					<div class="challenge-message">
						Challenge <span class="bold">{{ user.username }}</span> in a game of <span class="bold">{{ game.label }}</span> with the following rules:
					</div>

					<div class="game-settings">
						<FormSelect
							v-model="gameLength"
							label="Game length"
							:options="gameLengthOptions"
						/>

						<FormSelect
							v-model="paddleSize"
							label="Paddle size"
							:options="paddleSizeOptions"
						/>

						<FormSelect
							v-model="ballSpeed"
							label="Ball speed"
							:options="ballSpeedOptions"
						/>

						<FormSelect
							v-model="ballSize"
							label="Ball size"
							:options="ballSizeOptions"
						/>
					</div>

					<div class="buttons-wrapper">
						<FormButton
							:disabled="!canChallengePLayer || loading"
							@click="challenge"
						>
							Challenge
						</FormButton>
					</div>
				</div>
				<div v-show="challengeSent">
					<div class="challenge-message-sent">
						You have challenged <span class="bold">{{ user.username }}</span> in a game of <span class="bold">{{ game.label }}</span>
						with the following rules:
					</div>

					<GameSettingsSummary
						v-if="settings"
						:game="game.value"
						:settings="settings"
					/>

					<TimeoutCountdown
						ref="countdown"
						@timeout="cancelChallenge"
					/>

					<div class="buttons-wrapper">
						<FormButton
							danger
							@click="cancelChallenge"
						>
							Cancel
						</FormButton>
					</div>
				</div>
			</div>
		</modal>
	</div>
</template>

<script>
	import { mapState, mapGetters } from 'vuex';
	import { hideChallengeSettingsModal } from '@/services/modal';
	import TimeoutCountdown from '@/components/TimeoutCountdown';
	import GameSettingsSummary from '@/components/GameSettingsSummary';

	export default {
		components: {
			TimeoutCountdown,
			GameSettingsSummary
		},
		data() {
			return {
				userId: null,
				game: {},
				settings: null,
				loading: false,
				challengeSent: false,
				gameLength: 'normal',
				gameLengthOptions: [
					'long',
					'normal',
					'short'
				],
				ballSpeed: 'normal',
				ballSpeedOptions: [
					'slow',
					'normal',
					'fast'
				],
				ballSize: 'normal',
				ballSizeOptions: [
					'big',
					'normal',
					'small'
				],
				paddleSize: 'normal',
				paddleSizeOptions: [
					'big',
					'normal',
					'small'
				]
			};
		},
		computed: {
			...mapState('config', [
				'userStatuses'
			]),
			...mapGetters('auth', [
				'userSession'
			]),
			...mapGetters('lobby', [
				'usersMap'
			]),
			user() {
				if (!this.userId) {
					return null;
				}

				return this.usersMap[this.userId];
			},
			canChallengePLayer() {
				return (
					this.userSession.status.raw === this.userStatuses.online && this.user.status.raw === this.userStatuses.online
				);
			},
			canCloseModal() {
				return !this.challengeSent;
			}
		},
		methods: {
			onBeforeOpen(e) {
				this.challengeSent = false;
				this.userId = e.params.userId;
				this.game = this.$options.filters.gamesMap(e.params.game);
			},
			async challenge() {
				if (this.loading) {
					return;
				}

				this.loading = true;

				this.settings = {
					gameLength: this.gameLength,
					ballSpeed: this.ballSpeed,
					ballSize: this.ballSize,
					paddleSize: this.paddleSize
				};

				//use $listeners instead of $emit in order to be able to await the response
				const success = await this.$listeners.challenge({
					user: this.user,
					game: this.game.value,
					settings: this.settings
				});

				if (success) {
					this.challengeSent = true;
					this.startCountdown();
				}

				this.loading = false;
			},
			startCountdown() {
				if (this.$refs.countdown) {
					this.$refs.countdown.startCountdown();
				}
			},
			stopCountdown() {
				if (this.$refs.countdown) {
					this.$refs.countdown.stopCountdown();
				}
			},
			/**
			 * Closes the modal
			 */
			closeModal() {
				hideChallengeSettingsModal();
			},
			cancelChallenge() {
				this.$emit('cancel', this.user);
				this.closeModal();
			},
			onHeaderCloseClick() {
				if (this.challengeSent) {
					this.cancelChallenge();
				} else {
					this.closeModal();
				}
			}
		}
	};
</script>

<style scoped lang="scss">
	.challenge-settings-modal {
		.content {
			.challenge-message, .challenge-message-sent {
				text-align: center;
				font-size: 20px;
			}

			.challenge-message {
				padding: 10px 0px;
			}

			.challenge-message-sent {
				padding-top: 10px;
			}

			.game-settings {
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;
				margin-bottom: 10px;
				padding: 15px;
				background-color: $gray-almost-white;
				border-radius: 5px;

				.form-select {
					width: 48%;
					margin-bottom: 15px;
				}
			}
		}
	}
</style>
