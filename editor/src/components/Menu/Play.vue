<template>
	<v-menu
		offset-y
		:close-on-content-click="false"
		v-model="menu"
	>
		<template v-slot:activator="{ on }">
			<v-btn text v-on="on">
				Game
			</v-btn>
		</template>
		<v-list dense>
			<v-list-item @click="startGame()">
				<v-list-item-title>Play from beginning</v-list-item-title>
			</v-list-item>
			<v-list-item @click="startGame(cache.music.seek())">
				<v-list-item-title>Play from current location</v-list-item-title>
			</v-list-item>

			<v-divider></v-divider>

			<v-list-item>
        <v-list-item-action>
					<v-checkbox v-model="editor.auto"></v-checkbox>
        </v-list-item-action>
				<v-list-item-title>Auto</v-list-item-title>
			</v-list-item>

			<GameSettings @click="menu = false"/>
		</v-list>
	</v-menu>
</template>

<script>
import Data from '../Helper/Data';
import Cache from '../Helper/Cache';
import Vue from 'vue';
import GameSettings from './PlaySettings';

function startGameHelper() {
	if (Cache.music.playing()) {
		Cache.music.pause();
		Cache.playState = 0;
	}
	Cache.gamePlaying = true;
	window.BGDSS.chart = JSON.stringify(Data);
	window.BGDSS.auto = Data.editor.auto;
	window.BGDSS.reloadConfig();
	Vue.nextTick(() => {
		Cache.timeline = [];
		window.BGDSS.startGame();
	});
}

export default {
	components: {
		GameSettings
	},
	data: () => ({
		editor: Data.editor,
		cache: Cache,
		menu: 0
	}),
	methods: {
		startGame: function(time) {
			if (time == undefined) {
				time = 0;
			}
			window.BGDSS.playLocation = time;
			this.menu = 0;
			startGameHelper();
		}
	}
};
</script>

<style scoped>
</style>