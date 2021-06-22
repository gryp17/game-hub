<template>
	<div :class="['message-timestamp', alignment]">
		<span :title="fullDate">
			{{ formattedDate }}
		</span>
	</div>
</template>

<script>
	import moment from 'moment';

	export default {
		props: {
			alignment: {
				type: String,
				default: 'left'
			},
			date: {
				type: String,
				required: true
			}
		},
		computed: {
			fullDate() {
				return moment(this.date).format('YYYY-MM-DD HH:mm:ss');
			},
			formattedDate() {
				const date = moment(this.date);

				if (date.isSame(moment(), 'day')) {
					return date.format('[Today at] HH:mm:ss');
				}

				if (date.isSame(moment().subtract(1, 'day'), 'day')) {
					return date.format('[Yesterday at] HH:mm:ss');
				}

				return this.fullDate;
			}
		}
	};
</script>

<style lang="scss" scoped>
	.message-timestamp {
		&.right {
			text-align: right;
		}

		span {
			font-size: 13px;
			font-weight: bold;
			color: $gray-light;
			cursor: default;
		}
	}
</style>
