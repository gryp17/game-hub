<template>
	<div class="lobby-page">
		<div class="header">
			header
		</div>
		<div class="content-wrapper">
			<div class="chat-wrapper">
				<div class="messages-list">
					<div>message</div><div>message</div><div>message</div><div>message</div><div>message</div><div>message</div><div>message</div><div>message</div><div>message</div><div>message</div><div>message</div>
					<div>message</div><div>message</div><div>message</div><div>message</div><div>message</div><div>message</div><div>message</div><div>message</div>
					<div>message</div><div>message</div><div>message</div><div>message</div><div>message</div><div>message</div><div>message</div>
					<div>message</div><div>message</div><div>message</div><div>message</div><div>message</div>
					<div>message</div><div>message</div><div>message</div><div>message</div><div>message</div>
				</div>
				<div class="controls">
					controls
				</div>
			</div>
			<div class="users-list">
				users list
				<div>user</div><div>user</div><div>user</div><div>user</div><div>user</div><div>user</div><div>user</div>
				<div>user</div><div>user</div><div>user</div><div>user</div><div>user</div>
				<div>user</div><div>user</div><div>user</div><div>user</div><div>user</div>
				<div>user</div><div>user</div><div>user</div><div>user</div><div>user</div><div>user</div>
				<div>user</div><div>user</div><div>user</div><div>user</div><div>user</div><div>user</div>
				<div>user</div><div>user</div><div>user</div><div>user</div><div>user</div><div>user</div><div>user</div>
				<div>user</div><div>user</div><div>user</div><div>user</div><div>user</div><div>user</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
	$header-height: 48px;

	.lobby-page {
		height: 100%;

		.header {
			height: $header-height;
			padding: 15px;
			background-color: $gray-darkest;
		}

		.content-wrapper {
			display: flex;
			flex: 1;
			height: calc(100% - #{$header-height});

			.chat-wrapper {
				display: flex;
				flex-direction: column;
				flex: 1;
				background-color: $gray;

				.messages-list {
					overflow-y: auto;

					> div {
						padding: 10px;
					}
				}

				.controls {
					padding: 20px 15px;
					background-color: $gray-dark;
					border-right: solid 1px $gray-darkest;
				}
			}

			.users-list {
				height: 100%;
				width: 250px;
				background-color: $gray-dark;
				overflow-y: auto;

				> div {
					padding: 10px;
				}
			}
		}
	}
</style>
