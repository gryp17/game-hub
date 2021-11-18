import { Howl } from 'howler';

import challenge from '@/assets/audio/challenge.mp3';
import pongHit from '@/assets/audio/pong-hit.mp3';
import volleyHit from '@/assets/audio/volley-hit.mp3';
import whistle from '@/assets/audio/whistle.mp3';
import jump from '@/assets/audio/jump.mp3';
import flip from '@/assets/audio/flip.mp3';
import dead from '@/assets/audio/dead.mp3';

import mop from '@/assets/audio/music/mop.mp3';
import hysteria from '@/assets/audio/music/hysteria.mp3';
import bliss from '@/assets/audio/music/bliss.mp3';
import time from '@/assets/audio/music/time.mp3';
import uprising from '@/assets/audio/music/uprising.mp3';
import contagion from '@/assets/audio/music/contagion.mp3';
import popcorn from '@/assets/audio/music/popcorn.mp3';
import paranoid from '@/assets/audio/music/paranoid.mp3';

//sound effects
const tracks = {
	challenge,
	pongHit,
	volleyHit,
	whistle,
	jump,
	flip,
	dead
};

//background music tracks
const musicTracks = {
	mop,
	hysteria,
	bliss,
	time,
	uprising,
	contagion,
	popcorn,
	paranoid
};

const howlerTracks = {};

//preload the tracks so they can be used in howler
Object.keys(tracks).forEach((key) => {
	const track = tracks[key];
	howlerTracks[key] = new Howl({
		src: [track],
		autoplay: false
	});
});

const player = new Audio();

/**
 * Plays an audio track once
 * @param {String} track
 * @param {Float} volume
 */
function playTrack(track, volume = 1) {
	if (howlerTracks[track]) {
		const sound = howlerTracks[track];
		sound.volume(volume);
		sound.play();
	}
}

/**
 * Throttled version of the playTrack method that can only be called once every 100 miliseconds
 */
const throttledPlayTrack = _.throttle(playTrack, 100);

/**
 * Plays all the music tracks shuffled and repeating
 * @param {Float} volume
 */
function playMusic(volume = 0.5) {
	const audioTracks = _.shuffle(Object.values(musicTracks));
	let currentTrack = 0;

	player.src = audioTracks[currentTrack];
	player.volume = volume;
	const promise = player.play();

	//catch autoplay exceptions
	if (promise !== null) {
		promise.catch(() => {});
	}

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
	throttledPlayTrack,
	playMusic,
	stopMusic
};
