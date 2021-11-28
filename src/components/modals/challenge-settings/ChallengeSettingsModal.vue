<template>
	<div class="challenge-settings-modal">
		<modal
			:adaptive="true"
			:scrollable="true"
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

					<GameSettings v-model="settings" :game="game.value" />

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
	import GameSettings from '@/components/modals/challenge-settings/GameSettings';
	import GameSettingsSummary from '@/components/GameSettingsSummary';

	export default {
		components: {
			TimeoutCountdown,
			GameSettings,
			GameSettingsSummary
		},
		data() {
			return {
				userId: null,
				game: {},
				settings: null,
				loading: false,
				challengeSent: false
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
			/**
			 * Returns the user's profile by mapping the userId using the usersMap
			 * @returns {Object}
			 */
			user() {
				if (!this.userId) {
					return null;
				}

				return this.usersMap[this.userId];
			},
			/**
			 * Indicates whetner the user can be challenged
			 * @returns {Boolean}
			 */
			canChallengePLayer() {
				return (
					this.userSession.status.raw === this.userStatuses.online && this.user.status.raw === this.userStatuses.online
				);
			},
			/**
			 * Indicates whether the modal can be closed
			 * @returns {Boolean}
			 */
			canCloseModal() {
				return !this.challengeSent;
			}
		},
		methods: {
			/**
			 * Bootstraps the modal before its opened
			 * @param {Object} e
			 */
			onBeforeOpen(e) {
				this.challengeSent = false;
				this.userId = e.params.userId;
				this.game = this.$options.filters.gamesMap(e.params.game);
			},
			/**
			 * Sends the challenge and the custom game settings to the target user
			 */
			async challenge() {
				if (this.loading) {
					return;
				}

				this.loading = true;

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
			/**
			 * Starts the countdown
			 */
			startCountdown() {
				if (this.$refs.countdown) {
					this.$refs.countdown.startCountdown();
				}
			},
			/**
			 * Stops the countdown
			 */
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
			/**
			 * Emits the cancel event with the user data
			 */
			cancelChallenge() {
				this.$emit('cancel', this.user);
				this.closeModal();
			},
			/**
			 * Triggered when the header X icon is clocked
			 * The behaviour is different whether the challenge has been sent or not
			 */
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
		}
	}
</style>
