<template>
	<div :class="['message', { own }]">
		{{ message.content }}
	</div>
</template>

<script>
	export default {
		props: {
			message: {
				type: Object,
				required: true
			},
			own: Boolean
		},
		data() {
			return {
				linkifiedOptions: {
					className: 'linkified-link',
					attributes(href) {
						return {
							title: href
						};
					}
				}
			};
		}
	};
</script>

<style lang="scss">
	.message {
		margin: 10px;
		padding: 30px;
		background-color: $gray-light;
	}
</style>
