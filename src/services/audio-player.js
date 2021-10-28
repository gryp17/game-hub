import challenge from '@/assets/audio/challenge.mp3';
import hit from '@/assets/audio/hit.mp3';
import mop from '@/assets/audio/music/mop.mp3';
import hysteria from '@/assets/audio/music/hysteria.mp3';
import bliss from '@/assets/audio/music/bliss.mp3';
import time from '@/assets/audio/music/time.mp3';
import uprising from '@/assets/audio/music/uprising.mp3';

//sound effects
const tracks = {
	challenge,
	hit
};

//background music tracks
const musicTracks = {
	mop,
	hysteria,
	bliss,
	time,
	uprising
};

const player = document.getElementById('audio-player');

/**
 * Plays an audio track once
 * @param {String} track
 */
function playTrack(track) {
	if (tracks[track]) {
		new Audio(tracks[track]).play();
	}
}

/**
 * Plays all the music tracks shuffled and repeating
 * @param {Float} volume
 */
function playMusic(volume = 0.5) {
	const audioTracks = _.shuffle(Object.values(musicTracks));
	let currentTrack = 0;

	player.src = audioTracks[currentTrack];
	player.volume = volume;
	player.play();

	//once the current track is over start playin the next track
	player.onended = () => {
		currentTrack++;

		//repeat the playlist from the beginning
		if (currentTrack > audioTracks.length - 1) {
			currentTrack = 0;
		}

		player.src = audioTracks[currentTrack];
		player.play();
	};
}

/**
 * Stops playing the music tracks
 */
function stopMusic() {
	player.pause();
	player.currentTime = 0;
}

export default {
	playTrack,
	playMusic,
	stopMusic
};
