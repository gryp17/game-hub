<template>
	<div class="signup-form">
		<FormInput
			v-model="email"
			:error="errors.email"
			@focus="clearError"
			type="text"
			name="email"
			floating-label
			dark
			placeholder="Email"
		></FormInput>

		<FormInput
			v-model="username"
			:error="errors.username"
			@focus="clearError"
			type="text"
			name="username"
			floating-label
			dark
			placeholder="Username"
		></FormInput>

		<FormInput
			v-model="password"
			:error="errors.password"
			@focus="clearError"
			type="password"
			name="password"
			floating-label
			dark
			placeholder="Password"
		></FormInput>

		<FormInput
			v-model="repeatPassword"
			:error="errors.repeatPassword"
			@focus="clearError"
			type="password"
			name="repeatPassword"
			floating-label
			dark
			placeholder="Repeat password"
		></FormInput>

		<FormButton
			:disabled="submitting"
			@click="submit">
			Sign up
		</FormButton>
	</div>
</template>

<script>
	import { mapState, mapActions } from 'vuex';

	const formName = 'signup';

	export default {
		data() {
			return {
				email: '',
				username: '',
				password: '',
				repeatPassword: '',
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
				'signup'
			]),
			...mapActions('forms', [
				'setFormErrors',
				'clearFormError',
				'resetFormErrors'
			]),
			/**
			 * Submits the signup form
			 */
			async submit() {
				if (this.submitting) {
					return;
				}

				this.submitting = true;

				const params = {
					email: this.email,
					username: this.username,
					password: this.password,
					repeatPassword: this.repeatPassword
				};

				const data = await this.signup(params);

				if (data && data.user) {
					this.$router.push({
						name: 'lobby'
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
	.signup-form {
		.form-button {
			display: block;
			margin: auto;
			margin-top: 20px;
		}
	}
</style>
