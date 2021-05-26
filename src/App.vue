<template>
	<div id="app">
		<router-view/>
	</div>
</template>

<style lang="scss">
	@import '~@/assets/css/_vue-tabs';
	@import '~@/assets/css/_vue-toasted';

	*,
	:after,
	:before {
		box-sizing:border-box;
	}

	body, html {
		margin: 0;
		padding: 0;
		height: 100%;
	}

	body {
		background-color: $background;
		font-family:  $font-family;
		color: $text-color;

		:focus {
			outline: none;
		}

		::-moz-focus-inner {
			border: 0;
		}

		input {
			filter: none;
		}

		button:focus {
			outline: none;
		}

		a {
			color: $purple;
		}

		#app {
			display: flex;
			flex-direction: column;
			height: 100%;
		}
	}
</style>
