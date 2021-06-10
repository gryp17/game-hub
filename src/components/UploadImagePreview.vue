<template>
	<div :class="['upload-image-preview', { error }]">
		<img :src="image" class="image" />

		<div class="overlay">
			<i class="fas fa-camera"></i>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			image: String,
			error: Boolean
		}
	};
</script>

<style scoped lang="scss">
	.upload-image-preview {
		$size: 100px;

		position: relative;
		border-radius: 100%;
		border: solid 2px transparent;
		overflow: hidden;
		cursor: pointer;

		&:hover {
			.overlay {
				height: $size;
				padding-top: 40px;
			}
		}

		&.error {
			border-color: $red;
		}

		.image {
			width: $size;
			height: $size;
			border-radius: 0px;
			margin-top: 0;
		}

		.overlay {
			position: absolute;
			left: 0;
			right: 0;
			bottom: 0;
			margin: auto;
			width: 100%;
			height: 30px;
			padding-top: 5px;
			text-align: center;
			background-color: rgba($gray-darkest, 0.5);
			transition: all 200ms ease-in;

			.fa-camera {
				font-size: 20px;
				color: $white;
			}
		}
	}
</style>
