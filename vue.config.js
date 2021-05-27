const webpack = require('webpack');
const path = require('path');

module.exports = {
	configureWebpack: {
		plugins: [
			new webpack.ProvidePlugin({
				_: 'lodash',
				jQuery: 'jquery',
				$: 'jquery',
				'global.jQuery': 'jquery'
			})
		],
		resolve: {
			alias: {
				'~pong': path.resolve(__dirname, 'games/pong')
			}
		}
	},
	//change the app/html title
	chainWebpack: (config) => {
		config
			.plugin('html')
			.tap((args) => {
				args[0].title = 'GameHub';
				return args;
			});
	},
	css: {
		loaderOptions: {
			sass: {
				//imports the provided scss files globally (in every vue component)
				//so you don't have to import them manually
				prependData: `
					@import '@/assets/css/_variables.scss';
				`
			}
		}
	}
};
