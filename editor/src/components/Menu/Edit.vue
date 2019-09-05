<template>
	<v-menu
		offset-y
		v-model="menu"
	>
		<template v-slot:activator="{ on }">
			<v-btn text v-on="on">
				Edit
			</v-btn>
		</template>
		<v-list dense>
			<v-list-item @click="openBpmDialog()">
				<v-list-item-title>BPM and offset</v-list-item-title>
			</v-list-item>
			<v-list-item @click="openSettingDialog()">
				<v-list-item-title>Settings</v-list-item-title>
			</v-list-item>
		</v-list>
		
		<!-- BPM dialog -->
		<v-dialog
			v-model="bpmdialog"
			max-width="600"
		>
			<v-card>
				<v-card-title class="headline">BPM and Offset</v-card-title>
				<v-card-text>
					<v-form v-model="bpmvalid">
						<v-container>
							<v-row dense v-for="(b, index) in bpm" :key="index">
								<v-col cols="2">
									<v-subheader># {{index}}</v-subheader>
								</v-col>
								<v-col cols="2">
									<v-text-field
										v-model.number="b.time[0]"
										:rules="timeRule"
										label="Bar"
										hide-details
										required
									></v-text-field>
								</v-col>
								<v-col cols="1">
									<v-text-field
										v-model.number="b.time[1]"
										:rules="positiveRule"
										label="N"
										hide-details
										required
									></v-text-field>
								</v-col>
								<v-col cols="1">
									<v-text-field
										v-model.number="b.time[2]"
										:rules="timeRule"
										label="D"
										hide-details
										required
									></v-text-field>
								</v-col>
								<v-col cols="4">
									<v-text-field
										v-model.number="b.value"
										:rules="bpmRule"
										label="BPM value"
										hide-details
										required
									></v-text-field>
								</v-col>
								<v-col cols="1">
									<v-subheader>
										<v-btn
											text
											@click="removeBpm(index)"
										>
											<v-icon>mdi-close</v-icon>
										</v-btn>
									</v-subheader>
								</v-col>
							</v-row>
							<v-row class="justify-space-around">
								<v-col cols="2">
									<v-btn
										text
										@click="newBpm()"
									>
										<v-icon>mdi-plus</v-icon>
									</v-btn>
								</v-col>
								<v-col cols="6">
									<v-text-field
										v-model="offset"
										:rules="offsetRule"
										label="Offset (ms)"
										required
									></v-text-field>
								</v-col>
							</v-row>
						</v-container>
					</v-form>
				</v-card-text>
				<v-card-actions>
					<div class="flex-grow-1"></div>
					<v-btn
						color="red darken-1"
						text
						@click="bpmdialog = false"
					>
						Cancel
					</v-btn>
					<v-btn
						color="green darken-1"
						text
						@click="saveBpm()"
						:disabled="!bpmvalid"
					>
						Done
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<!-- end of BPM dialog -->

		<!-- setting dialog -->
		<v-dialog
			v-model="settingdialog"
			max-width="600"
		>
			<v-card>
				<v-card-title class="headline">Settings</v-card-title>
				<v-card-text>
					<v-switch v-model="editor.soundeffect" label="Sound Effect"></v-switch>
				</v-card-text>
				<v-card-actions>
					<div class="flex-grow-1"></div>
					<v-btn
						color="green darken-1"
						text
						@click="settingdialog = false"
					>
						Done
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<!-- end of setting dialog -->
	</v-menu>
</template>

<script>
import Data from '../Data';
import TrackEditor from '../Track';

export default {
	components: {
	},
	data: () => ({
		editor: Data.editor,
		bpmdialog: false,
		settingdialog: false,
		bpmvalid: false,
		bpm: [],
		offset: Data.offset,
		timeRule: [
			val => (val == parseInt(val) && val >= 1) || 'X'
		],
		positiveRule: [
			val => (val == parseInt(val) && val >= 0) || 'X'
		],
		bpmRule: [
			val => (val >= 1 && val <= 10000) || 'Invalid BPM'
		],
		offsetRule: [
			val => (val >= -100000 && val <= 100000) || 'Invalid offset'
		],
		menu: false
	}),
	methods: {
		openBpmDialog: function() {
			this.menu = false;
			this.bpm.splice(0, this.bpm.length);
			for (let bpm of Data.bpm) {
				this.bpm.push({
					value: bpm.value,
					time: [bpm.time[0], bpm.time[1], bpm.time[2]]
				});
			}
			this.offset = Data.offset;
			this.bpmdialog = true;
		},
		openSettingDialog: function() {
			this.menu = false;
			this.settingdialog = true;
		},
		saveBpm: function() {
			this.bpmdialog = false;
			Data.offset = this.offset;
			TrackEditor.updateBpm(this.bpm);
		},
		removeBpm: function(index) {
			if (this.bpm.length <= 1) return;
			this.bpm.splice(index, 1);
		},
		newBpm: function() {
			let bpm = this.bpm[this.bpm.length - 1];
			this.bpm.push({
				value: bpm.value,
				time: [bpm.time[0], bpm.time[1], bpm.time[2]]
			})
		}
	}
};
</script>

<style scoped>
</style>