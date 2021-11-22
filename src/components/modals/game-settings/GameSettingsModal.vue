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
								<ControlInput
									v-model="data.keys[index]"
									:valid-input-key-codes="validInputKeyCodes"
									@input="onInput($event, inputType, index)"
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
	import { mapState } from 'vuex';
	import { hideGameSettingsModal } from '@/services/modal';
	import ControlInput from '@/components/modals/game-settings/ControlInput';

	export default {
		components: {
			ControlInput
		},
		data() {
			return {
				inputs: {},
				submitting: false
			};
		},
		computed: {
			...mapState('config', [
				'validInputKeyCodes'
			]),
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
			 * Called when the control input value changes
			 * @param {Number} keyCode
			 * @param {String} inputType
			 * @param {Number} index
			 */
			onInput(keyCode, inputType, index) {
				if (!keyCode) {
					return;
				}

				//check if this keyCode was used for another input and clear it
				_.forOwn(this.inputs, (data, type) => {
					data.keys.forEach((key, keyIndex) => {
						if (inputType === type && keyIndex === index) {
							return;
						}

						//clear the input value
						if (key === keyCode) {
							this.inputs[type].keys[keyIndex] = null;
						}
					});
				});
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
				}
			}
		}
	}
</style>
