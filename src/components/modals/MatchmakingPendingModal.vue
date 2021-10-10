<template>
	<div class="matchmaking-pending-modal">
		<modal
			:adaptive="true"
			:width="'100%'"
			:maxWidth="480"
			:height="'auto'"
			:clickToClose="false"
			name="matchmaking-pending-modal"
			@before-open="onBeforeOpen"
			@opened="startCountdown"
			@before-close="stopCountdown"
		>
			<div class="header">
				Opponent found

				<FormButton
					transparent
					class="close-btn"
					@click="cancel"
				>
					<i class="fas fa-times"></i>
				</FormButton>
			</div>
			<div class="content center">
				<div class="matchmaking-text">
					An opponent has been found for a game of <span class="bold">{{ game.label }}</span>
				</div>

				Starting match in

				<TimeoutCountdown
					ref="countdown"
					:timeout="10"
					@timeout="accept"
				/>

				<div class="buttons-wrapper">
					<FormButton
						danger
						@click="cancel"
					>
						Cancel
					</FormButton>
				</div>
			</div>
		</modal>
	</div>
</template>

<script>
	import { hideMatchmakingPendingModal } from '@/services/modal';
	import TimeoutCountdown from '@/components/TimeoutCountdown';

	export default {
		components: {
			TimeoutCountdown
		},
		data() {
			return {
				game: {}
			};
		},
		methods: {
			/**
			 * Bootstraps the modal before its opened
			 * @param {Object} e
			 */
			onBeforeOpen(e) {
				this.game = this.$options.filters.gamesMap(e.params.game);
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
				hideMatchmakingPendingModal();
			},
			/**
			 * Emits the cancel event
			 */
			cancel() {
				this.$emit('cancel');
				this.closeModal();
			},
			/**
			 * Emits the accept event
			 */
			accept() {
				this.$emit('accept');
				this.closeModal();
			}
		}
	};
</script>

<style lang="scss">
	.matchmaking-pending-modal {
		.content {
			.matchmaking-text {
				padding: 10px 0px;
				margin-bottom: 5px;
				font-size: 20px;
			}
		}
	}
</style>
