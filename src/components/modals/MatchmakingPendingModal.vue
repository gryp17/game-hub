<template>
	<div class="matchmaking-pending-modal">
		<modal
			:adaptive="true"
			:width="'100%'"
			:maxWidth="460"
			:height="'auto'"
			:clickToClose="false"
			name="matchmaking-pending-modal"
			@before-open="onBeforeOpen"
			@opened="startCountdown"
			@before-close="stopCountdown"
		>
			<div class="header">
				Opponent found
			</div>
			<div class="content">
				An opponent has been found for a game of <span class="bold">{{ game.label }}</span>
				<br/>
				<br/>
				Starting match in:
				<br/>

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
			onBeforeOpen(e) {
				this.game = this.$options.filters.gamesMap(e.params.game);
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
				hideMatchmakingPendingModal();
			},
			cancel() {
				this.$emit('cancel');
				this.closeModal();
			},
			accept() {
				this.$emit('accept');
				this.closeModal();
			}
		}
	};
</script>

<style lang="scss">
	.matchmaking-pending-modal {
		.header {
			padding: 10px;
			background-color: $gray-darkest;
			color: $white;
			font-weight: bold;
		}

		.content {
			padding: 10px;
			text-align: center;
			color: $text-color-dark;

			.buttons-wrapper {
				text-align: center;
			}
		}
	}
</style>
