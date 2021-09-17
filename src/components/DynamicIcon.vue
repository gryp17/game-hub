<template>
	<span
		:class="['dynamic-icon', type, className]"
		:key="icon"
		:title="title"
		v-on="{
			...$listeners
		}"
	>
		<i
			:class="icon"
		/>
	</span>
</template>

<script>
	/**
	 * Component that solves an issue with the Font Awesome icons not updating correctly.
	 * There is no need to use it if your icon is not dynamic.
	 */
	export default {
		props: {
			icon: {
				type: String,
				required: true
			},
			type: {
				type: String,
				default: 'inline',
				validator(value) {
					return ['inline', 'block', 'inline-block'].includes(value);
				}
			},
			title: String,
			className: String
		}
	};
</script>

<style scoped lang="scss">
	.dynamic-icon {
		&.inline {
			display: inline;
		}

		&.block {
			display: block;
		}

		&.inline-block {
			display: inline-block;
		}
	}
</style>
