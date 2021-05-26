<template>
	<div class="form-file-input form-group">
		<label v-if="label">
			{{ label }}
		</label>

		<div @click="openFileBrowser()">
			<slot>
				<FormButton class="browse-btn">
					<i class="fas fa-file-upload"></i>
					Select file
				</FormButton>
			</slot>
		</div>

		<input
			:class="className"
			:name="name"
			v-on="$listeners"
			ref="file"
			type="file"
		/>

		<FormInputError>
			{{ error }}
		</FormInputError>
	</div>
</template>

<script>
	import FormInputError from '@/components/forms/FormInputError';

	export default {
		components: {
			FormInputError
		},
		props: {
			label: String,
			className: String,
			name: String,
			error: String
		},
		methods: {
			/**
			 * Opens the file input
			 */
			openFileBrowser() {
				this.$refs.file.click();
			},
			/**
			 * Resets the selected file value
			 */
			resetValue() {
				this.$refs.file.value = '';
			}
		}
	};
</script>

<style scoped lang="scss">
	.form-file-input {
		position: relative;
		padding-bottom: 15px;

		.browse-btn{
			display: block;
			width: 100%;

			.fa-file-upload {
				margin-right: 5px;
				margin-top: -3px;
			}
		}

		input {
			display: none;
		}

		.form-input-error {
			width: 100%;
			text-align: center;
		}
	}
</style>
