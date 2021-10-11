<template>
	<div class="experience-bar">
		<div class="bar-title">
			Experience
		</div>

		<div class="inner-wrapper">
			<div class="level" title="Current level">
				{{ level }}
			</div>
			<div class="bar-wrapper">
				<div
					class="fill-text"
					:title="title"
				>
					{{ percentage }}%
				</div>
				<div
					class="fill"
					:style="fillStyle"
				>
				</div>
			</div>
			<div class="level" title="Next level">
				{{ nextLevel }}
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			experience: Number,
			minExperience: Number,
			maxExperience: Number,
			level: Number,
			nextLevel: Number,
			percentage: Number
		},
		computed: {
			/**
			 * Returns the experience bar fill styles
			 * @returns {Object}
			 */
			fillStyle() {
				return {
					width: `${this.percentage}%`
				};
			},
			/**
			 * Returns the experience bar title
			 * @returns {String}
			 */
			title() {
				return `${this.experience} / ${this.maxExperience} experience`;
			}
		}
	};
</script>

<style lang="scss">
	.experience-bar {
		padding: 10px 0px;

		.bar-title {
			margin-bottom: 3px;
			text-align: center;
		}

		.inner-wrapper {
			display: flex;
			align-items: center;

			.level {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 40px;
				height: 40px;
				text-align: center;
				background-color: $purple;
				color: $white;
				font-weight: bold;
				border: solid 1px $white;
				border-radius: 100%;
				z-index: 1;
			}

			.bar-wrapper {
				flex: 1;
				position: relative;
				padding: 0px 15px;
				height: 24px;
				margin-left: -19px;
				margin-right: -19px;
				border: solid 1px $purple;
				text-align: center;
				background-color: lighten($purple, 18%);

				.fill-text {
					position: absolute;
					left: 0px;
					right: 0px;
					width: 100%;
					height: 100%;
					display: flex;
					justify-content: center;
					align-items: center;
					font-weight: bold;
					color: $white;
				}

				.fill {
					height: 100%;
					background-color: $purple;
				}
			}
		}
	}
</style>
