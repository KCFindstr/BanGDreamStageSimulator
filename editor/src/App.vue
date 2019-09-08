<template>
	<v-app>
		<v-app-bar app dense clipped-left class="appbar" @click="debug()">
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

		<div tabindex="0" v-if="!cache.gamePlaying" @keydown="keyDown">
			<LeftBar v-if="cache.music"/>

			<v-content v-if="cache.music">
				<v-container>
					<Editor/>
				</v-container>
			</v-content>
		</div>
		<template v-else>
			<div id="game-main"></div>
		</template>
	</v-app>
</template>

<script>
import Cache from './components/Helper/Cache';
import Data from './components/Helper/Data';
import LeftBar from './components/LeftBar';
import MenuBar from './components/MenuBar';
import Editor from './components/Editor';
import { setInterval } from 'timers';
import TrackEditor from './components/Helper/Track';
import Vue from 'vue';
import removeAllSelection from './components/Helper/RemoveSelection';
import syncScrollbar from './components/Helper/SyncScrollbar';
import PlayControl from './components/Helper/PlayControl';
import KeyDownHandler from './components/Helper/KeyDownHandler';

// sync
let html = document.scrollingElement;

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
			let time = window.BGDSS.endGame();
			Cache.gamePlaying = false;
			Cache.music.seek(time / 1000);
			Vue.nextTick(() => {
				syncScrollbar(time / 1000);
			});
		},
		debug: function() {
		},
		keyDown: KeyDownHandler
  }
};

// sync music with scrollbar
function syncMusic() {
	PlayControl(-1);
	let pos = html.scrollHeight - $(window).outerHeight() - html.scrollTop;
	pos /= Data.editor.rowheight;
	pos += 1;
	let time = TrackEditor.getTimeInSeconds(pos) - Data.offset / 1000;
	time = Math.max(0, time);
	Cache.music.seek(time);
}

setInterval(() => {
	if (!Cache.music || !Cache.music.playing()) {
		return;
	}
	let time = Cache.music.seek();
	if (typeof(time) == 'number' && !isNaN(time))
		syncScrollbar(time);
});

$(window).scroll(function(e) {
	if (!Cache.music || Cache.music.playing()) {
		return;
	}
	syncMusic();
});

window.addEventListener('keydown', (e) => {
	if (e.target == document.body) {
		KeyDownHandler(e);
	}
});

</script>

<style>
html, body {
	width: 100%;
	height: 100%;
	padding: 0;
	margin: 0;
	font-size: 20px !important;
	-webkit-overflow-scrolling: none;
}
* {
	text-transform: none !important;
}
:not(input):not(textarea),
:not(input):not(textarea)::after,
:not(input):not(textarea)::before {
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -o-user-select: none;
  user-select: none;
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  user-drag: none;
}
</style>

<style scoped>
.appbar {
	z-index: 100 !important;
}
</style>