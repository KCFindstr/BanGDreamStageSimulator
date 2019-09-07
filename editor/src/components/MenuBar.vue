<template>
  <v-toolbar-items>
		<FileMenu/>
		<EditMenu v-if="cache.music"/>
		<PlayMenu v-if="cache.music"/>
		<ViewMenu v-if="cache.music"/>
  </v-toolbar-items>
</template>

<script>
import Data from './Helper/Data';
import Cache from './Helper/Cache';
import FileMenu from './Menu/File';
import EditMenu from './Menu/Edit';
import PlayMenu from './Menu/Play';
import ViewMenu from './Menu/View';

export default {
	components: {
		FileMenu,
		EditMenu,
		PlayMenu,
		ViewMenu
	},
	data: () => ({
		editor: Data.editor,
		cache: Cache
	})
};
</script>

<style>
</style>