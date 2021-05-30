<template>
	<div class="challenge-timeout-countdown">
		{{ counter }}
	</div>
</template>

<script>
	export default {
		data() {
			return {
				challengeTimeout: 20, //seconds
				challengeCounterInterval: null,
				counter: 20
			};
		},
		methods: {
			startCountdown() {
				this.counter = this.challengeTimeout;
				this.challengeCounterInterval = setInterval(() => {
					this.counter--;

					//if the time is over stop the interval and cancel the challenge
					if (this.counter < 0) {
						clearInterval(this.challengeCounterInterval);
						this.$emit('timeout');
					}
				}, 1000);
			},
			stopCountdown() {
				clearInterval(this.challengeCounterInterval);
			}
		}
	};
</script>

<style lang="scss">
	.challenge-timeout-countdown {
		padding: 15px 0px;
		font-size: 18px;
		text-align: center;
		font-weight: bold;
	}
</style>
