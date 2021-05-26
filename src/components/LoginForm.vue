<template>
	<div class="login-form">
		<FormInput
			v-model="email"
			:error="errors.email"
			@keyup.enter="submit"
			@keyup="clearError"
			@focus="clearError"
			type="text"
			name="email"
			floating-label
			placeholder="Email"
		></FormInput>

		<FormInput
			v-model="password"
			:error="errors.password"
			@keyup.enter="submit"
			@keyup="clearError"
			@focus="clearError"
			type="password"
			name="password"
			floating-label
			placeholder="Password"
		></FormInput>

		<FormButton
			:disabled="submitting"
			@click="submit">
			Login
		</FormButton>
	</div>
</template>

<script>
	import { mapState, mapActions } from 'vuex';

	const formName = 'login';

	export default {
		data() {
			return {
				email: '',
				password: '',
				submitting: false
			};
		},
		computed: {
			...mapState('forms', {
				errors: (state) => state.errors[formName]
			})
		},
		created() {
			this.resetFormErrors(formName);
		},
		methods: {
			...mapActions('auth', [
				'login'
			]),
			...mapActions('forms', [
				'setFormErrors',
				'clearFormError',
				'resetFormErrors'
			]),
			/**
			 * Submits the login form
			 */
			async submit() {
				if (this.submitting) {
					return;
				}

				this.submitting = true;

				const params = {
					email: this.email,
					password: this.password
				};

				const data = await this.login(params);

				if (data && data.user) {
					this.$router.push({
						name: 'chat'
					});
				} else if (data && data.errors) {
					this.setFormErrors({
						errors: data.errors,
						form: formName
					});
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
			}
		}
	};
</script>

<style lang="scss">
	.login-form {
		.form-button {
			display: block;
			margin: auto;
			margin-top: 20px;
		}
	}
</style>
