<template>
  <v-navigation-drawer app permanent stateless clipped class="navbar" width="200">
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title">编辑工具</v-list-item-title>
        <v-list-item-subtitle>Edit Tools</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-list dense nav>
      <v-list-item-group v-model="editor.tool" mandatory>
        <v-list-item link key="0" @click="changeTool(0)">
          <v-list-item-icon class="note-icon">
            <img src="img/note_normal.png" />
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Tap</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link key="1" @click="changeTool(1)">
          <v-list-item-icon class="note-icon">
            <img src="img/note_flick.png" />
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Flick</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link key="2" @click="changeTool(2)">
          <v-list-item-icon class="note-icon">
            <img src="img/note_long.png" />
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Hold</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link key="3" @click="changeTool(3)">
          <v-list-item-icon class="note-icon">
            <v-icon>mdi-delete</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Remove</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>

    <v-divider></v-divider>

    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title">播放器</v-list-item-title>
        <v-list-item-subtitle>Music Player</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-list-item>
      <v-list-item-content>
        <v-list-item-title>{{cache.formattedTime}}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-list dense nav>
      <v-list-item-group v-model="cache.playState" mandatory>
        <v-list-item link key="0" @click="musicPlay()">
          <v-list-item-icon class="note-icon">
            <v-icon>mdi-play-circle</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Play</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link key="1" @click="musicPause()">
          <v-list-item-icon class="note-icon">
            <v-icon>mdi-pause-circle</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Pause</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>

    </v-list>

  </v-navigation-drawer>
</template>

<script>
import Data from './Helper/Data';
import Cache from './Helper/Cache';
import TrackEditor from './Helper/Track';
import { setInterval } from 'timers';
import removeAllSelection from './Helper/RemoveSelection';
import ChangeTool from './Helper/ChangeTool';
import PlayControl from './Helper/PlayControl';
import KeyDownHandler from './Helper/KeyDownHandler';

function convertSecondsToTime(seconds) {
  let ret = '--:--';
  try {
    ret = new Date(seconds * 1000).toISOString().substr(14, 5);
  } catch (e) {
    console.log(seconds, e);
  }
  return ret;
}

function getPlayPosition() {
  let tot = convertSecondsToTime(Cache.music.duration());
  let cur = convertSecondsToTime(Cache.music.seek());
  return cur + ' / ' + tot;
}

setInterval(() => {
  if (Data.editor.tool != 2) {
    Cache.noteHead = null;
  }
  if (!Cache.music) return;
  Cache.formattedTime = getPlayPosition();
}, 100);

export default {
	components: {
	},
	data: () => ({
    editor: Data.editor,
    cache: Cache
  }),
  methods: {
    musicPlay: function() {
      PlayControl(1);
    },
    musicPause: function() {
      PlayControl(-1);
    },
    changeTool: ChangeTool,
    keyDown: KeyDownHandler
  }
};
</script>

<style scoped>
.navbar {
  font-size: 20px;
}
.note-icon {
  justify-content: center;
	width: 50px;
}
.note-icon > img {
	width: 100%;
  height: 32px;
}
</style>