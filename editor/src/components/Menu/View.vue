<template>
	<v-menu
		offset-y
		:close-on-content-click="false"
		v-model="menu"
	>
		<template v-slot:activator="{ on }">
			<v-btn text v-on="on">
				View
			</v-btn>
		</template>
		<v-list dense>
			<v-subheader>Vertical Stretch</v-subheader>
			<v-list-item dense>
				<v-list-item-content>
					<v-slider
						v-model.lazy="rowheight"
						min="100"
						max="300"
						step="10"
						@blur.native="updateRowheight()"
					></v-slider>
				</v-list-item-content>
			</v-list-item>
			<v-divider></v-divider>
      <v-subheader>Horizontal Division</v-subheader>
			<v-list-item-group v-model="editor.division" color="primary" mandatory>
				<v-list-item v-for="val in gridvalues" :value="val" :key="val" @click="changeGrid(val)">
					<v-list-item-title>1 / {{val}}</v-list-item-title>
				</v-list-item>
			</v-list-item-group>
		</v-list>
	</v-menu>
</template>

<script>
import Data from '../Helper/Data';

export default {
	components: {
	},
	data: () => ({
		editor: Data.editor,
		gridvalues: [1, 2, 3, 4, 6, 8, 12, 16],
		menu: 0,
		rowheight: Data.editor.rowheight
	}),
	methods: {
		changeGrid: function(val) {
			this.editor.division = val;
		},
		updateRowheight() {
			Data.editor.rowheight = this.rowheight;
		}
	}
};
</script>

<style scoped>
</style>