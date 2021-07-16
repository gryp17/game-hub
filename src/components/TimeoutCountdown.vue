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
		created() {
			this.counter = this.timeout;
		},
		methods: {
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
