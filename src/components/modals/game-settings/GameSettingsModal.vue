<template>
	<div class="game-settings-modal">
		<modal
			:adaptive="true"
			:scrollable="true"
			:width="'100%'"
			:maxWidth="480"
			:height="'auto'"
			name="game-settings-modal"
			@before-open="onBeforeOpen"
		>
			<div class="header">
				Game settings

				<FormButton
					transparent
					class="close-btn"
					@click="closeModal"
				>
					<i class="fas fa-times"></i>
				</FormButton>
			</div>
			<div class="content">
				<Tabs
					ref="tabs"
					cache-lifetime="0"
					class="light"
					:options="{ useUrlFragment: false }"
				>
					<Tab
						name="Keyboard controls"
					>
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
					</Tab>
					<Tab
						name="Sound"
					>
						<FormSwitch v-model="audio.sound">
							Sound effects
						</FormSwitch>

						<FormSwitch v-model="audio.music">
							Background music
						</FormSwitch>
					</Tab>

					<div class="buttons-wrapper">
						<FormButton
							:disabled="submitting"
							@click="submit"
						>
							Save
						</FormButton>

						<FormButton
							outline
							@click="reset"
						>
							Reset
						</FormButton>
					</div>
				</Tabs>
			</div>
		</modal>
	</div>
</template>

<script>
	import { Tabs, Tab } from 'vue-tabs-component';
	import { mapState, mapActions } from 'vuex';
	import { hideGameSettingsModal } from '@/services/modal';
	import ControlInput from '@/components/modals/game-settings/ControlInput';

	export default {
		components: {
			Tabs,
			Tab,
			ControlInput
		},
		data() {
			return {
				inputs: {},
				audio: {
					sound: true,
					music: true
				},
				submitting: false
			};
		},
		computed: {
			...mapState('config', [
				'defaultControls',
				'validInputKeyCodes'
			]),
			...mapState('settings', [
				'controls',
				'sound',
				'music'
			])
		},
		methods: {
			...mapActions('settings', [
				'updateSettings'
			]),
			/**
			 * Bootstraps the modal before its opened
			 * @param {Object} e
			 */
			onBeforeOpen(e) {
				this.inputs = _.cloneDeep(this.controls);
				this.audio.sound = this.sound;
				this.audio.music = this.music;
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

				const data = await this.updateSettings({
					controls: this.inputs,
					...this.audio
				});

				if (data && !data.errors) {
					this.closeModal();
				}

				this.submitting = false;
			},
			/**
			 * Resets the settings to their default values
			 */
			reset() {
				const currentTab = this.$refs.tabs.lastActiveTabHash;

				if (currentTab === '#keyboard-controls') {
					this.inputs = _.cloneDeep(this.defaultControls);
				}

				if (currentTab === '#sound') {
					this.audio.sound = true;
					this.audio.music = true;
				}
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
			padding: 5px;

			.tabs-component-panels {
				padding: 10px;
			}

			.controls-table {
				margin-bottom: 5px;
				width: 100%;

				thead {
					td {
						padding-bottom: 10px;
						text-align: center;
						font-weight: bold;
					}
				}

				tbody {
					td {
						padding-bottom: 5px;

						&:first-child {
							padding-left: 10px;
							padding-right: 10px;
							text-align: center;
							text-transform: uppercase;
						}
					}
				}
			}

			.buttons-wrapper {
				padding: 5px;

				.form-button {
					min-width: 70px;
				}
			}
		}
	}
</style>
