import AudioPlayer from '@/services/audio-player';

const actions = {
	/**
	 * Plays an audio track once
	 * @param {Object} context
	 * @param {Object} data
	 */
	playTrack(context, { track, volume }) {
		const soundEnabled = context.rootGetters['auth/userSession'].sound;

		if (soundEnabled) {
			AudioPlayer.throttledPlayTrack(track, volume);
		}
	},
	/**
	 * Plays the music tracks
	 * @param {Object} context
	 * @param {Float} volume
	 */
	playMusic(context, volume) {
		const musicEnabled = context.rootGetters['auth/userSession'].music;

		if (musicEnabled) {
			AudioPlayer.playMusic(volume);
		}
	},
	/**
	 * Stops the music track
	 * @param {Object} context
	 */
	stopMusic(context) {
		AudioPlayer.stopMusic();
	}
};

export default {
	namespaced: true,
	actions
};
