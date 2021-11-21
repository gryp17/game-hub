<template>
	<div class="game-settings-modal">
		<modal
			:adaptive="true"
			:width="'100%'"
			:maxWidth="480"
			:height="'auto'"
			name="game-settings-modal"
			@before-open="onBeforeOpen"
		>
			<div class="header">
				Game settings
			</div>
			<div class="content">

				<h4 class="controls-title">Game Controls</h4>

				<table class="controls-table">
					<thead>
						<tr>
							<td>Input</td>
							<td>Primary</td>
							<td>Secondary</td>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(data, inputType) in inputs" :key="inputType">
							<td>
								{{ inputType }}
							</td>
							<td v-for="(keyCode, index) in data.keys" :key="index">
								<FormInput
									:value="keyCode | keyCodesMap"
									@keydown="onKeyDown"
									@keyup="onKeyUp($event, inputType, index)"
								/>
							</td>
						</tr>
					</tbody>
				</table>

				<br/>
				<br/>

				{{ sound }}
				{{ music }}
				{{ inputs }}

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
	import Vue from 'vue';
	import { mapState } from 'vuex';
	import { hideGameSettingsModal } from '@/services/modal';

	export default {
		data() {
			return {
				inputs: {},
				submitting: false
			};
		},
		computed: {
			...mapState('settings', [
				'controls',
				'sound',
				'music'
			])
		},
		methods: {
			/**
			 * Bootstraps the modal before its opened
			 * @param {Object} e
			 */
			onBeforeOpen(e) {
				this.inputs = _.cloneDeep(this.controls);
			},
			/**
			 * Handles the controls inputs keydown event
			 * @param {Object} e
			 */
			onKeyDown(e) {
				e.preventDefault();
			},
			/**
			 * Handles the controls inputs keyup event
			 * @param {Object} e
			 * @param {String} inputType
			 * @param {Number} index
			 */
			onKeyUp(e, inputType, index) {
				//update the input key code (the key code gets mapped to it's name in the markup)
				const keyCode = (e.which) ? e.which : e.keyCode;
				Vue.set(this.inputs[inputType].keys, index, keyCode);

				//TODO: check if this code was already used somewhere else and set it to ''
			},
			/**
			 * Submits the game settings modal
			 */
			async submit() {
				if (this.submitting) {
					return;
				}

				this.submitting = true;

				//TODO: call the api

				this.submitting = false;
			},
			/**
			 * Closes the modal
			 */
			closeModal() {
				hideGameSettingsModal();
			}
		}
	};
</script>

<style lang="scss">
	.game-settings-modal {
		.content {
			.controls-title {
				margin: 15px 0px;
				text-align: center;
			}

			.controls-table {
				width: 100%;

				thead {
					td {
						padding-bottom: 10px;
						text-align: center;
						font-weight: bold;
					}
				}

				tbody {
					td:first-child {
						padding-bottom: 18px;
						padding-left: 10px;
						padding-right: 10px;
						text-align: center;
						text-transform: uppercase;
					}

					.form-input .form-control {
						text-transform: uppercase;
					}
				}
			}
		}
	}
</style>
