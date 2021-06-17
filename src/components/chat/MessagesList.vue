<template>
	<div class="messages-list">
		<div v-for="message in messages" :key="message.id">
			{{ message }}
		</div>
	</div>
</template>

<script>
	import { mapGetters } from 'vuex';

	//TODO: implement fetching of older messages on scroll

	export default {
		computed: {
			...mapGetters('chat', [
				'messages'
			])
		}
	};
</script>

<style scoped lang="scss">
	.messages-list {
		flex: 1;
		display: flex;
		flex-direction: column-reverse;
		overflow-y: auto;

		> div {
			padding: 10px;
		}
	}
</style>
