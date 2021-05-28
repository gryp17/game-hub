<template>
	<button
		:class="['form-button', {active, outline, transparent, danger, success}, className]"
		:type="type"
		v-on="{
			...$listeners
		}"
	>
		<slot>Click me</slot>
	</button>
</template>

<script>
	export default {
		props: {
			className: String,
			type: {
				type: String,
				default: 'button'
			},
			active: {
				type: Boolean,
				default: false
			},
			outline: {
				type: Boolean,
				default: false
			},
			transparent: {
				type: Boolean,
				default: false
			},
			danger: {
				type: Boolean,
				default: false
			},
			success: {
				type: Boolean,
				default: false
			}
		}
	};
</script>

<style scoped lang="scss">
	.form-button {
		padding: 10px 15px;
		border: solid 1px transparent;
		background-color: $purple;
		color: $white;
		transition: all 0.4s ease-in-out;
		font-size: 16px;
		cursor: pointer;

		&:hover, &:active, &:focus, &.active {
			background-color: darken($purple, 15%);
		}

		&:disabled {
			background-color: lighten($purple, 15%);
			cursor: not-allowed;

			&:hover {
				background-color: lighten($purple, 15%);
			}
		}

		&.outline {
			background-color: $white;
			color: $purple;
			border: solid 1px $purple;

			&:hover, &:active, &:focus, &.active {
				background-color: $purple;
				color: $white;
			}
		}

		&.transparent {
			background-color: transparent;
			color: $purple;
			opacity: 0.8;

			&:hover, &.active {
				background-color: $gray-light;
				opacity: 1;
			}
		}

		&.success {
			background-color: $green;

			&:hover, &:active, &:focus, &.active {
				background-color: darken($green, 15%);
			}
		}

		&.danger {
			background-color: $red;

			&:hover, &:active, &:focus, &.active {
				background-color: darken($red, 15%);
			}
		}

		> svg {
			margin-right: 3px;
		}
	}
</style>
