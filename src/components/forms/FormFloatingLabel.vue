<template>
	<div :class="['form-floating-label', {'visible': visible}]">
		<slot></slot>
	</div>
</template>

<script>
	export default {
		props: {
			visible: {
				default: false
			}
		}
	};
</script>

<style scoped lang="scss">
	.form-floating-label {
		position: absolute;
		top: 0px;
		left: 5px;
		padding: 0px 5px;
		background-color: $white;
		color: $text-color-dark;
		border: solid 1px $purple;
		font-size: 10px;
		font-weight: bold;
		opacity: 0;
		z-index: 6;
		transition: all 100ms ease-in;

		&.visible {
			top: -8px;
			opacity: 1;
		}
	}
</style>
