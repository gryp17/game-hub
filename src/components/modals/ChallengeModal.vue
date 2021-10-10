<template>
	<div class="challenge-modal">
		<modal
			:adaptive="true"
			:width="'100%'"
			:maxWidth="520"
			:height="'auto'"
			:clickToClose="false"
			name="challenge-modal"
			@before-open="onBeforeOpen"
			@opened="startCountdown"
			@before-close="stopCountdown"
		>
			<div class="header">
				Game challenge

				<FormButton
					transparent
					class="close-btn"
					@click="decline"
				>
					<i class="fas fa-times"></i>
				</FormButton>
			</div>
			<div class="content center">
				<div class="challenge-text">
					You have been challenged in a game of <span class="bold">{{ game.label }}</span> by <span class="bold">{{ user.username }}</span>
					with the following rules:
				</div>

				<GameSettingsSummary
					v-if="settings"
					:game="game.value"
					:settings="settings"
				/>

				<TimeoutCountdown
					ref="countdown"
					@timeout="decline"
				/>

				<div class="buttons-wrapper">
					<FormButton
						success
						@click="accept"
					>
						Accept
					</FormButton>
					<FormButton
						danger
						@click="decline"
					>
						Decline
					</FormButton>
				</div>
			</div>
		</modal>
	</div>
</template>

<script>
	import { hideChallengeModal } from '@/services/modal';
	import TimeoutCountdown from '@/components/TimeoutCountdown';
	import GameSettingsSummary from '@/components/GameSettingsSummary';

	export default {
		components: {
			TimeoutCountdown,
			GameSettingsSummary
		},
		data() {
			return {
				user: {},
				game: {},
				settings: null
			};
		},
		methods: {
			/**
			 * Bootstraps the modal before its opened
			 * @param {Object} e
			 */
			onBeforeOpen(e) {
				this.user = e.params.user;
				this.game = this.$options.filters.gamesMap(e.params.game);
				this.settings = e.params.settings;
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
				hideChallengeModal();
			},
			/**
			 * Emits the accept event with the user data
			 */
			accept() {
				this.stopCountdown();
				this.$emit('accept', this.user);
				this.closeModal();
			},
			/**
			 * Emits the decline event with the user data
			 */
			decline() {
				this.$emit('decline', this.user);
				this.closeModal();
			}
		}
	};
</script>

<style scoped lang="scss">
	.challenge-modal {
		.content {
			.challenge-text {
				padding: 10px 0px;
				font-size: 20px;
			}
		}
	}
</style>
