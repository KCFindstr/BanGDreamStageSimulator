<template>
	<v-menu offset-y v-model="menu">
		<template v-slot:activator="{ on }">
			<v-btn text v-on="on">
				File
			</v-btn>
		</template>
		<v-list dense>
			<v-list-item @click.stop="importMusic()">
				<v-list-item-title>Import Music</v-list-item-title>
			</v-list-item>
			<v-list-item @click.stop="importChart()" :disabled="!cache.music">
				<v-list-item-title>Import Chart</v-list-item-title>
			</v-list-item>
			<v-list-item @click.stop="exportChart()" :disabled="!cache.music">
				<v-list-item-title>Export</v-list-item-title>
			</v-list-item>
		</v-list>


		<!-- chart dialog -->
		<v-dialog
			v-model="chartdialog"
			max-width="600"
		>
			<v-card>
				<v-card-title class="headline">Import Chart File</v-card-title>
				<v-card-text>
					Choose a chart file.
					<v-file-input label="Click to select chart file" accept=".json" v-model="chart"></v-file-input>
				</v-card-text>
				<v-card-actions>
					<div class="flex-grow-1"></div>
					<v-btn
						color="red darken-1"
						text
						@click="chartdialog = false"
					>
						Cancel
					</v-btn>
					<v-btn
						color="green darken-1"
						text
						@click="importChartEnd()"
						:disabled="!chart"
					>
						Done
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<!-- end of chart dialog -->

		<!-- file dialog -->
		<v-dialog
			v-model="filedialog"
			max-width="600"
		>
			<v-card>
				<v-card-title class="headline">Import Music File</v-card-title>
				<v-card-text>
					Add a music file.
					<v-file-input label="Click to select music file" accept=".mp3,.wav,.ogg" v-model="music" required></v-file-input>
				</v-card-text>
				<v-card-actions>
					<div class="flex-grow-1"></div>
					<v-btn
						color="red darken-1"
						text
						@click="filedialog = false"
					>
						Cancel
					</v-btn>
					<v-btn
						color="green darken-1"
						text
						@click="importMusicEnd()"
						:disabled="!music"
					>
						Done
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<!-- end of file dialog -->
	</v-menu>
</template>

<script>
import Data from '../Helper/Data';
import Cache from '../Helper/Cache';
import TrackEditor from '../Helper/Track';
import Vue from 'vue';
import { saveAs } from 'file-saver';
import removeAllSelection from '../Helper/RemoveSelection';
import Scroll from '../Helper/Scroll';

export default {
	components: {
	},
	data: () => ({
		editor: Data.editor,
		filedialog: false,
		chartdialog: false,
		exportdialog: false,
		menu: false,
		music: null,
		chart: null,
		cache: Cache
	}),
	methods: {
		importMusic: function() {
			this.music = null;
			this.menu = false;
			this.filedialog = true;
		},
		importChart: function() {
			this.chart = null;
			this.menu = false;
			this.chartdialog = true;
		},
		exportChart: function() {
			this.menu = false;
			this.exportdialog = true;
			let chart = JSON.parse(JSON.stringify(Data));
			chart.notes.sort((a, b) => TrackEditor.timeDiff(a.time, b.time, 60));
			let blob = new Blob([JSON.stringify(chart)], {type: 'application/json'});
			saveAs(blob, 'level.json');
		},
		importChartEnd: function() {
			this.chartdialog = false;
			if (this.chart) {
				var reader = new FileReader();
				
				reader.onload = function() {
					removeAllSelection();
					TrackEditor.loadChart(JSON.parse(reader.result));
					Vue.nextTick(() => {
						Scroll();
					});
				}
				reader.readAsText(this.chart);
			}
		},
		importMusicEnd: function() {
			this.filedialog = false;
			if (this.music) {
				let reader = new FileReader();
				let format = null;
				if (!this.music.type.startsWith('audio')) {
					this.music = this.music.slice(0, this.music.size, "audio/mp3")
				}
				
				reader.onload = () => {
					window.BGDSS.music = reader.result;
					let music = new Howl({
						src: reader.result,
						html5: true,
						preload: true,
						format: 'mp3',
						onload: () => {
							this.cache.music = music;
							TrackEditor.updateBpm();
							Vue.nextTick(() => {
								Scroll();
							});
						},
						onloaderror: console.log
					});
				}
				reader.readAsDataURL(this.music);
			}
		}
	}
};
</script>

<style scoped>
</style>