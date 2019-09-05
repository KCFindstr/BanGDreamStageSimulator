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
			<v-list-item @click="menu=0" disabled>
				<v-list-item-title>Play from current location</v-list-item-title>
			</v-list-item>
			<v-divider></v-divider>
			<v-list-item>
        <v-list-item-action>
					<v-checkbox v-model="editor.auto"></v-checkbox>
        </v-list-item-action>
				<v-list-item-content>
					<v-list-item-title>Auto</v-list-item-title>
				</v-list-item-content>
			</v-list-item>
		</v-list>
	</v-menu>
</template>

<script>
import Data from '../Data';
import Cache from '../Cache';
import Vue from 'vue';

function startGameHelper() {
	if (Cache.music.playing()) {
		Cache.music.pause();
		Cache.playState = 0;
	}
	Cache.gamePlaying = true;
	window.BGDSS.chart = JSON.stringify(Data);
	window.BGDSS.auto = Data.editor.auto;
	Vue.nextTick(() => {
		window.BGDSS.startGame();
	});
}

export default {
	components: {
	},
	data: () => ({
		editor: Data.editor,
		menu: 0
	}),
	methods: {
		startGame: function() {
			this.menu = 0;
			startGameHelper();
		}
	}
};
</script>

<style scoped>
</style>