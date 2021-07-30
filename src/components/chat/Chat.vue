<template>
	<div class="chat">
		<MessagesList
			:messages="messages"
			:user-session="userSession"
			@get-messages="getMessages"
			@open-profile="showProfileModal"
		/>

		<ChatControls
			@send-message="sendMessage"
		/>
	</div>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex';
	import MessagesList from '@/components/chat/MessagesList';
	import ChatControls from '@/components/chat/ChatControls';

	import { showProfileModal } from '@/services/modal';

	export default {
		components: {
			MessagesList,
			ChatControls
		},
		computed: {
			...mapGetters('auth', [
				'userSession'
			]),
			...mapGetters('chat', [
				'messages'
			])
		},
		methods: {
			...mapActions('chat', [
				'getMessages',
				'sendMessage'
			]),
			showProfileModal(userId) {
				showProfileModal(userId);
			}
		}
	};
</script>

<style lang="scss">
	.chat {
		display: flex;
		flex-direction: column;
		background-color: $gray;
	}
</style>
