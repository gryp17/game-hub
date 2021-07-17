<template>
	<div class="edit-profile-modal">
		<modal
			:adaptive="true"
			:width="'100%'"
			:maxWidth="480"
			:height="'auto'"
			@before-open="onBeforeOpen"
			name="edit-profile-modal"
		>
			<div class="header">
				Edit profile

				<FormButton
					transparent
					class="close-btn"
					@click="closeModal"
				>
					<i class="fas fa-times"></i>
				</FormButton>
			</div>
			<div class="content">
				<div class="avatar-wrapper">
					<FormFileInput
						:error="errors.avatar"
						@click="clearError"
						@change="avatarChanged"
						ref="avatar"
						name="avatar"
					>
						<UploadImagePreview :image="avatarPreview" :error="!!errors.avatar"/>
					</FormFileInput>

					<div class="avatar-hint">
						Allowed formats: JPG and PNG under 1MB
					</div>
				</div>

				<FormInput
					v-model="password"
					:error="errors.password"
					@focus="clearError"
					type="password"
					name="password"
					floating-label
					placeholder="New password"
				/>

				<FormInput
					v-model="repeatPassword"
					:error="errors.repeatPassword"
					@focus="clearError"
					type="password"
					name="repeatPassword"
					floating-label
					placeholder="Repeat password"
				/>

				<FormInput
					v-model="bio"
					:error="errors.bio"
					@keyup="clearError"
					@focus="clearError"
					tag="textarea"
					name="bio"
					floating-label
					placeholder="Bio"
				/>

				<div class="buttons-wrapper">
					<FormButton
						:disabled="submitting"
						@click="submit"
					>
						Save
					</FormButton>
				</div>
			</div>
		</modal>
	</div>
</template>

<script>
	import { mapState, mapGetters, mapActions } from 'vuex';
	import { hideEditProfileModal } from '@/services/modal';
	import UploadImagePreview from '@/components/UploadImagePreview';

	const formName = 'editProfile';

	export default {
		components: {
			UploadImagePreview
		},
		data() {
			return {
				avatar: null,
				avatarPreview: null,
				password: '',
				repeatPassword: '',
				bio: '',
				submitting: false
			};
		},
		computed: {
			...mapState('forms', {
				errors: (state) => state.errors[formName]
			}),
			...mapGetters('auth', [
				'userSession'
			])
		},
		methods: {
			...mapActions('forms', [
				'setFormErrors',
				'clearFormError',
				'resetFormErrors'
			]),
			...mapActions('auth', [
				'updateUser'
			]),
			/**
			 * Closes the modal
			 */
			closeModal() {
				hideEditProfileModal();
			},
			/**
			 * Resets the form before opening the modal
			 */
			onBeforeOpen() {
				this.resetFormErrors(formName);
				this.resetState();
			},
			/**
			 * Updates the avatar and avatar preview values whenever the selected file changes
			 * @param {Object} e
			 */
			avatarChanged(e) {
				this.avatar = e.target.files[0];
				this.avatarPreview = URL.createObjectURL(e.target.files[0]);
			},
			/**
			 * Submits the edit profile modal
			 */
			async submit() {
				if (this.submitting) {
					return;
				}

				this.submitting = true;

				const formData = new FormData();

				['password', 'repeatPassword', 'avatar', 'bio'].forEach((field) => {
					if (this[field]) {
						formData.append(field, this[field]);
					}
				});

				const data = await this.updateUser(formData);

				if (data && data.errors) {
					this.setFormErrors({
						form: formName,
						errors: data.errors
					});
				} else {
					this.closeModal();
				}

				this.submitting = false;
			},
			/**
			 * Clears the form error related to this input
			 * @param {Object} e
			 */
			clearError(e) {
				const field = e.target.name;
				this.clearFormError({
					form: formName,
					field
				});
			},
			/**
			 * Resets the data/state back to it's default/initial value
			 */
			resetState() {
				Object.assign(this.$data, this.$options.data.call(this));

				this.bio = this.userSession.bio;
				this.avatarPreview = this.userSession.avatarLink;
			}
		}
	};
</script>

<style lang="scss">
	.edit-profile-modal {
		//make this modal appear under any other newly opened modals (in case there are more opened modals at the same time)
		.vm--container {
			z-index: 998;
		}

		.content {
			.avatar-wrapper {
				display: flex;
				flex-direction: column;
				justify-content: center;

				.upload-image-preview {
					margin: auto;
					width: 100px;
					height: 100px;
				}

				.avatar-hint {
					margin-top: 5px;
					margin-bottom: 10px;
					font-size: 10px;
					text-align: center;
					font-style: italic;
				}
			}
		}
	}
</style>
