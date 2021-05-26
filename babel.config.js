//hackfix for https://github.com/vuejs/vue-cli/issues/2637
process.env.VUE_CLI_BABEL_TRANSPILE_MODULES = true;

module.exports = {
	presets: [
		'@vue/cli-plugin-babel/preset'
	]
};
