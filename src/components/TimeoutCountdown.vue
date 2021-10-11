<template>
	<div class="timeout-countdown">
		{{ counter }}
	</div>
</template>

<script>
	export default {
		props: {
			timeout: {
				type: Number,
				default: 20 //seconds
			}
		},
		data() {
			return {
				counterInterval: null,
				counter: 20
			};
		},
		/**
		 * Resets the timeout counter when the component is created
		 */
		created() {
			this.counter = this.timeout;
		},
		methods: {
			/**
			 * Starts the countdown
			 */
			startCountdown() {
				this.counter = this.timeout;
				this.counterInterval = setInterval(() => {
					this.counter--;

					//if the time is over stop the interval and cemit the timeout event
					if (this.counter < 1) {
						clearInterval(this.counterInterval);
						this.$emit('timeout');
					}
				}, 1000);
			},
			/**
			 * Stops the countdown
			 */
			stopCountdown() {
				clearInterval(this.counterInterval);
			}
		}
	};
</script>

<style lang="scss">
	.timeout-countdown {
		padding: 15px 0px;
		font-size: 18px;
		text-align: center;
		font-weight: bold;
	}
</style>
