<template>
	<FormButton
		class="game-hud-button"
		transparent
		v-bind="$attrs"
		v-on="{
			...$listeners
		}"
	>
		<slot></slot>
	</FormButton>
</template>

<style scoped lang="scss">
	.game-hud-button.form-button.transparent {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 43px;
		height: 43px;
		padding: 0px;
		border-radius: 100%;
		border: solid 2px $purple;
		background-color: $white;
		opacity: 0.6;

		::v-deep svg {
			width: 100%;
			margin-right: 0px;
		}

		+ .form-button {
			margin-left: 10px;
		}

		&.active, &:hover, &.active:focus:hover {
			opacity: 1;
		}

		//mobile chrome focus/hover bugfix
		@media (hover: none) {
			&:hover, &:focus:hover {
				opacity: 0.6;
			}

			&.active, &.active:focus, &.active:hover, &.active:focus:hover {
				opacity: 1;
			}
		}
	}
</style>
