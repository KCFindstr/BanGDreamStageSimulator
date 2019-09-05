<template>
	<v-app>
		<v-app-bar app dense clipped-left class="appbar">
			<v-toolbar-title class="headline mr-3">
				<span>BGDSS Editor</span>
			</v-toolbar-title>
      <MenuBar v-if="!cache.gamePlaying"/>
			<v-toolbar-items v-else>
				<v-btn text @click="returnFromGame()">Back</v-btn>
			</v-toolbar-items>
			<v-spacer></v-spacer>
			<v-btn text href="https://github.com/KCFindstr" target="_blank">
				<span class="mr-2">By KCFindstr</span>
			</v-btn>
		</v-app-bar>

		<template v-if="!cache.gamePlaying">
			<LeftBar v-if="cache.music"/>

			<v-content v-if="cache.music">
				<v-container>
					<Editor/>
				</v-container>
			</v-content>
		</template>
		<template v-else>
			<div id="game-main"></div>
		</template>
	</v-app>
</template>

<script>
import Cache from './components/Cache';
import Data from './components/Data';
import LeftBar from './components/LeftBar';
import MenuBar from './components/MenuBar';
import Editor from './components/Editor';
import { setInterval } from 'timers';
import TrackEditor from './components/Track';

export default {
	name: 'App',
	components: {
    LeftBar,
		MenuBar,
		Editor
	},
	data: () => ({
		cache: Cache
  }),
  methods: {
		returnFromGame: function() {
			window.BGDSS.endGame();
			Cache.gamePlaying = false;
		}
  }
};

// sync
let html = document.documentElement;
let flick = new Howl({
	src: '/se/flick.wav',
	preload: true
});
let tap = new Howl({
	src: '/se/perfect.wav',
	preload: true
});

setInterval(() => {
	if (!Cache.music) return;
	if (!Cache.music.playing()) return;
	let pos = Cache.music.seek() + Data.offset / 1000;
	let timeline = Cache.timeline;
	while (Cache.head < timeline.length && pos >= timeline[Cache.head].time) {
		if (Data.editor.soundeffect) {
			if (timeline[Cache.head].type == 1) {
				flick.play();
			} else {
				tap.play();
			}
		}
		Cache.head++;
	}
	let time = TrackEditor.getTimeBySeconds(pos);
	Cache.targetPosition = html.scrollHeight - html.offsetHeight - time * Data.editor.rowheight;
	html.scrollTop = Cache.targetPosition;
}, 15)

window.addEventListener('scroll', function(e) {
	if (!Cache.music || Math.abs(html.scrollTop - Cache.targetPosition) <= 1) return;
	Cache.music.pause();
	Cache.playState = 1;
	let pos = html.scrollHeight - html.offsetHeight - html.scrollTop;
	pos /= Data.editor.rowheight;
	pos += 1;
	let time = TrackEditor.getTimeInSeconds(pos) - Data.offset / 1000;
	time = Math.max(0, time);
	Cache.music.seek(time);
});

</script>

<style>
html, body {
	width: 100%;
	height: 100%;
	padding: 0;
	margin: 0;
  font-size: 20px !important;
}
* {
	text-transform: none !important;
}
:not(input):not(textarea),
:not(input):not(textarea)::after,
:not(input):not(textarea)::before {
  -webkit-user-select: none;
  user-select: none;
  cursor: default;
}
</style>

<style scoped>
.appbar {
	z-index: 100 !important;
}
</style>