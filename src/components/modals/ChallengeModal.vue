<template>
	<div class="challenge-modal">
		<modal
			:adaptive="true"
			:width="'100%'"
			:maxWidth="460"
			:height="'auto'"
			:clickToClose="false"
			name="challenge-modal"
			@before-open="onBeforeOpen"
			@opened="startCountdown"
			@before-close="stopCountdown"
		>
			<div class="header">
				Game challenge
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
			onBeforeOpen(e) {
				this.user = e.params.user;
				this.game = this.$options.filters.gamesMap(e.params.game);
				this.settings = e.params.settings;
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
				hideChallengeModal();
			},
			accept() {
				this.stopCountdown();
				this.$emit('accept', this.user);
				this.closeModal();
			},
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
