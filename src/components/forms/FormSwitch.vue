<template>
	<div
		:class="['form-switch', className, { active: value }]"
	>
		<div class="inner-wrapper" @click="onInput">
			<div class="switch-wrapper">
				<div class="ball"></div>
			</div>
			<slot></slot>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			value: Boolean,
			className: String
		},
		methods: {
			/**
			 * Propagates the "input" event back to the parent (needed because of v-model)
			*/
			onInput() {
				this.$emit('input', !this.value);
			}
		}
	};
</script>

<style scoped lang="scss">
	.form-switch {
		margin-bottom: 10px;

		.inner-wrapper {
			display: inline-flex;
			align-items: center;
			cursor: pointer;

			.switch-wrapper {
				position: relative;
				margin-right: 5px;
				height: 17px;
				width: 30px;
				border-radius: 10px;
				border: solid 1px $gray-dark;
				transition: 500ms ease;

				.ball {
					position: absolute;
					top: 2px;
					left: 2px;
					width: 11px;
					height: 11px;
					border-radius: 100%;
					background-color: $gray-dark;
					transition: 500ms ease;
				}
			}
		}

		&.active {
			.switch-wrapper {
				background-color: $green;
				border-color: $green;

				.ball {
					left: 15px;;
					background-color: $white;
				}
			}
		}
	}
</style>
