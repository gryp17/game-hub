const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	configureWebpack: {
		plugins: [
			new webpack.ProvidePlugin({
				_: 'lodash',
				jQuery: 'jquery',
				$: 'jquery',
				'global.jQuery': 'jquery'
			}),
			//copy all game images from "games/pong/img" to "/dist/game-images/pong"
			//TODO: update this when adding a new game
			new CopyWebpackPlugin([
				{
					from: './games/pong/img',
					to: './game-images/pong'
				},
				{
					from: './games/volley/img',
					to: './game-images/volley'
				}
			])
		]
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
