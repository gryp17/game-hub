<template>
	<div class="form-input-error">
		<slot></slot>
	</div>
</template>

<style scoped lang="scss">
	.form-input-error {
		position: absolute;
		font-size: 11px;
		color: $red;
	}
</style>
