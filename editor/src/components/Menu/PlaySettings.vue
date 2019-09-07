<template>
	<v-list-item @click="$emit('click'); openGameSettings()">
		<v-list-item-title>Game Settings</v-list-item-title>
		<v-dialog v-model="gsdialog" max-width="600">
			<v-card>
				<v-card-title class="headline">Game Settings</v-card-title>
				<v-card-text>
					<v-slider v-model="config.speed" label="Note Speed" min="1" max="20" step="0.1">
						<template v-slot:append>
							<v-text-field
								v-model="config.speed"
								class="mt-0 pt-0"
								hide-details
								single-line
								type="number"
								min="1"
								max="20"
								step="0.1"
								style="width: 60px"
							></v-text-field>
						</template>
					</v-slider>
					<v-slider v-model="config.scale" label="Note Size" min="0.1" max="2" step="0.1">
						<template v-slot:append>
							<v-text-field
								v-model="config.scale"
								class="mt-0 pt-0"
								hide-details
								single-line
								type="number"
								min="0.1"
								max="2"
								step="0.1"
								style="width: 60px"
							></v-text-field>
						</template>
					</v-slider>
					<v-slider v-model="config.simuhint" label="Simu. Notes Helper Weight" min="0" max="10" step="1">
						<template v-slot:append>
							<v-text-field
								v-model="config.simuhint"
								class="mt-0 pt-0"
								hide-details
								single-line
								type="number"
								min="0"
								max="10"
								step="1"
								style="width: 60px"
							></v-text-field>
						</template>
					</v-slider>
				</v-card-text>
				<v-card-actions>
					<div class="flex-grow-1"></div>
					<v-btn color="red darken-1" text @click="gsdialog = false">Cancel</v-btn>
					<v-btn color="green darken-1" text @click="saveSettings()">Done</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-list-item>
</template>

<script>
import Data from "../Helper/Data";
import Cache from "../Helper/Cache";
import Vue from "vue";

export default {
	components: {},
	data: () => ({
		editor: Data.editor,
		cache: Cache,
		gsdialog: 0,
		config: {
			flick: 0,
			long: 0,
			normal: 0,
			se: 0,
			line: 0,
			speed: 10,
			scale: 1.5,
			simuhint: 5
		}
	}),
	methods: {
		openGameSettings: function() {
			let userConfig = cookie.get("config");
			if (userConfig && userConfig.length) {
				userConfig = JSON.parse(userConfig);
				for (let key in userConfig) {
					this.config[key] = userConfig[key];
				}
			}
			this.gsdialog = true;
		},
		saveSettings: function() {
			cookie.set("config", JSON.stringify(this.config));
			this.gsdialog = false;
		}
	}
};
</script>

<style scoped>
</style>