<template>
	<div :class="['dropdown-menu', direction]">
		<div
			class="dropdown-trigger"
			ref="trigger"
			@click="toggleActions"
		>
			<slot name="button" />
		</div>
		<div
			v-show="showActions"
			class="actions"
		>
			<slot name="items" />
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			direction: {
				type: String,
				default: 'left'
			}
		},
		data() {
			return {
				showActions: false
			};
		},
		mounted() {
			document.addEventListener('click', this.handleOutsideClick);
		},
		destroyed() {
			document.removeEventListener('click', this.handleOutsideClick);
		},
		methods: {
			/**
			 * Handles clicks outside of the component and closes the actions menu
			 * @param {Object} e
			 */
			handleOutsideClick(e) {
				const trigger = this.$refs.trigger;
				const isClickInside = trigger.contains(e.target);

				if (!isClickInside) {
					this.hideActions();
				}
			},
			/**
			 * Hides the actions menu
			 */
			hideActions() {
				this.showActions = false;
			},
			/**
			 * Toggles the actions menu
			 */
			toggleActions() {
				this.showActions = !this.showActions;
			}
		}
	};
</script>

<style lang="scss" scoped>
	.dropdown-menu {
		position: relative;

		.dropdown-trigger {
			display: flex;
		}

		.actions {
			position: absolute;
			margin-top: 3px;
			right: 0px;
			padding: 5px 0px;
			min-width: 200px;
			background-color: $white;
			text-align: left;
			z-index: 5;
			border: solid 1px $gray;
			border-radius: 3px;
			color: $text-color-dark;

			&::before {
				content: '';
				position: absolute;
				width: 0;
				height: 0;
				top: -24px;
				right: 12px;
				border: 12px solid transparent;
				border-bottom: 12px solid $white;
				pointer-events: none;
				filter: drop-shadow(0px -1px 0px $gray);
			}

			> div {
				padding: 10px;
				cursor: pointer;

				&:hover {
					background-color: $gray-very-light;
				}
			}
		}

		&.right {
			.actions {
				right: auto;
				left: 0px;

				&:before {
					right: auto;
					left: 12px;
				}
			}
		}
	}
</style>
