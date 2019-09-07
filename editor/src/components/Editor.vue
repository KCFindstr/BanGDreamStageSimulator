<template>
	<div class="chart">
		<!-- grid -->
		<div v-for="i in editor.maxrow" :key="-i-1" class="chart-row" :style="{height: editor.rowheight + 'px'}">
			<div class="number pink--text mr-3">{{editor.maxrow - i + 1}}</div>
			<div class="single-row">
				<div v-for="k in editor.division" :key="k" :style="{height: (editor.rowheight / editor.division) + 'px'}">
					<div v-for="j in 7" :key="j" :style="getBorderStyle(i * editor.division + k, j)" class="block" @click="event => handleBlockClick(event, i, k, j)"></div>
				</div>
			</div>
		</div>
		<!-- notes -->
		<div v-for="note in notes" :key="note.id">
			<!-- tap / flick -->
			<div v-if="note.type < 2" class="note"
				:style="computeNotePosition(note)"
				:class="{
					'note-selected': cache.selectedNotes[note.id] ? true: false,
					'note-tap': note.type === 1,
					'note-flick': note.type === 2
				}"
				@click="handleNoteMouseDown(note)"
				@contextmenu.prevent="removeNote(note)"
			>
				<img :src="getFileByNoteType(note.type)"/>
			</div>
			<!-- hold -->
			<div v-else-if="note.type === 2" class="note-hold">
				<!-- head -->
				<div class="note"
					:style="computeNotePosition(note)"
					:class="{'note-selected': cache.selectedNotes[note.id] ? true: false}"
					@click="handleNoteMouseDown(note, 0)"
					@contextmenu.prevent="removeNote(note)"
				>
					<img :src="getFileByNoteType(note.headtype, true)"/>
				</div>
				<!-- body -->
				<div class="long-note"
					:style="computeLongPosition(note)"
					:class="{'note-selected': cache.selectedNotes[note.id] ? true: false}"
					@click="handleNoteMouseDown(note, 1)"
					@contextmenu.prevent="removeNote(note)"
				>
					<img :src="getFileByNoteType(-1)"/>
				</div>
				<!-- tail -->
				<div class="note"
					v-if="note.tailtype != 2 && !(cache.noteHead && cache.noteHead.parent && cache.noteHead.parent.id == note.id)"
					:style="computeNotePosition(getEndNote(note))"
					:class="{'note-selected': cache.selectedNotes[note.id] ? true: false}"
					@click="handleNoteMouseDown(note, 2)"
					@contextmenu.prevent="removeNote(note)"
				>
					<img :src="getFileByNoteType(note.tailtype, true)"/>
				</div>
			</div>
		</div>
		<!-- editing -->
		<div v-if="cache.noteHead" class="note note-head" :style="computeNotePosition(cache.noteHead)" >
			<img :src="getFileByNoteType(0, true)"/>
		</div>
		<!-- line -->
		<div class="playline">
			<div>Playback Position</div>
		</div>
	</div>
</template>

<script>
import Data from './Helper/Data';
import Cache from './Helper/Cache';
import colors from 'vuetify/lib/util/colors';
import TrackEditor from './Helper/Track';
import Vue from 'vue';
import removeAllSelection from './Helper/RemoveSelection';
import selectNote from './Helper/SelectNote';

// concat hold notes
function concatHoldNote(note, parent, pos) {
	let head = Cache.noteHead;
	if (head) {
		// already have head
		if (!TrackEditor.earlyThan(head.time, note.time)) {
			Cache.noteHead = null;
			return;
		}
		// end of current hold must be head of another
		if (parent && (parent.prev || pos != 0)) {
			Cache.noteHead = null;
			return;
		}
		let newnote = {
			type: 2,
			time: head.time,
			track: head.track,
			endtrack: note.track,
			endtime: note.time,
			headtype: head.parent ? 2 : 0,
			tailtype: parent ? 2 : head.type,
			prev: head.parent ? head.parent.id : 0,
			next: parent ? parent.id : 0
		}
		TrackEditor.makeNote(newnote);
		// update predecessor info
		if (head.parent) {
			head.parent.tailtype = 2;
			head.parent.next = newnote.id;
		}
		// update successor info
		if (parent) {
			parent.headtype = 2;
			parent.prev = newnote.id;
		}
		Cache.noteHead = null;
		return;
	}
	if (parent) {
		// A note is clicked, must be tail
		if (pos != 2 || parent.next)
			return;
		Cache.noteHead = {
			track: parent.endtrack,
			time: parent.endtime,
			type: parent.tailtype,
			parent: parent
		};
	} else {
		Cache.noteHead = {
			time: note.time,
			track: note.track,
			type: 0,
		}
	}
}

export default {
	components: {
	},
	data: () => ({
		notes: Data.notes,
		editor: Data.editor,
		cache: Cache
	}),
	methods: {
		getBorderStyle: function(i, j) {
			let ret = {};
			let BorderStyle = '2px solid ';
			if (i % this.editor.division === 0) {
				BorderStyle += 'black';
			} else if (i * 2 % this.editor.division === 0) {
				BorderStyle += colors.lightBlue.base;
			} else if (i * 3 % this.editor.division === 0) {
				BorderStyle += colors.green.base;
			} else if (i * 4 % this.editor.division === 0) {
				BorderStyle += colors.orange.base;
			} else {
				BorderStyle = '1px dashed black';
			}
			if (i === this.editor.division + 1) {
				ret.borderTop = '2px solid black';
			}
			if (j === 1) {
				ret.borderLeft = '1px solid black';
			}
			ret.height = this.editor.rowheight / this.editor.division;
			ret.borderBottom = BorderStyle;
			return ret;
		},
		computeNoteRawPosition: function(note) {
			let ret = {};
			ret.left = note.track * 80 + 72;
			let time = TrackEditor.getTime(note.time) - 1;
			ret.bottom = time * this.editor.rowheight;
			return ret;
		},
		computeNotePosition: function(note) {
			let ret = this.computeNoteRawPosition(note);
			ret.bottom -= 16;
			ret.left += 'px';
			ret.bottom += 'px';
			return ret;
		},
		computeLongPosition: function(note) {
			let ret = {};
			let start = this.computeNoteRawPosition(note);
			let end = this.computeNoteRawPosition(this.getEndNote(note));
			ret.height = end.bottom - start.bottom + 'px';
			ret.bottom = start.bottom + 'px';
			ret.left = start.left + 5 + 'px';
			let deg = Math.atan2(end.left - start.left, start.bottom - end.bottom);
			ret.transform = 'skew(' + deg + 'rad)';
			return ret;
		},
		getFileByNoteType: function(type, isHold) {
			return TrackEditor.getFileByNoteType(type, isHold);
		},
		getEndNote: function(note) {
			return TrackEditor.getEndNote(note);
		},
		removeNote: function(note) {
			TrackEditor.removeNote(note.id);
		},
		handleNoteMouseDown: function(note, pos) {
			if (this.editor.tool == 3) {
				this.removeNote(note);
				return;
			}
			if (this.editor.tool == 2) {
				if (pos == 1 || pos == null) {
					selectNote(note);
				} else {
					concatHoldNote({
						time: pos == 0 ? note.time : note.endtime,
						track: pos == 0 ? note.track : note.endtrack,
					}, note, pos);
				}
				return;
			}
			if (pos == 2 && !note.next) {
				note.tailtype = this.editor.tool;
				return;
			}
			// select notes
			selectNote(note);
		},
		handleBlockClick: function(event, section, k, track) {
			if (removeAllSelection() || this.editor.tool == 3)
				return;
			k = this.editor.division - k;
			section = this.editor.maxrow - section + 1;
			track--;
			let height = this.editor.rowheight / this.editor.division;
			if (event.offsetY < height / 2) {
				k++;
				if (k >= this.editor.division) {
					k = 0;
					section++;
				}
			}
			let time = [section, k, this.editor.division];
			if (this.editor.tool == 2) {
				concatHoldNote({ time: time, track: track });
			} else {
				let note = {
					time: time,
					track: track,
					type: this.editor.tool
				};
				TrackEditor.makeNote(note);
				return;
			}
		}
	}
};
</script>

<style scoped>
.chart {
	position: relative;
	width: 100%;
	min-width: 700px;
	margin-bottom: 100px;
}
.single-row {
	position: relative;
	display: inline-block;
	line-height: 0 !important;
}
.number {
	position: relative;
	bottom: 10px;
	display: inline-block;
	width: 60px;
	font-size: 30px;
	text-align: right;
}
.block {
	display: inline-block;
	width: 80px;
	height: 100%;
	border-right: 1px solid black;
	border-bottom: 2px solid black;
	line-height: 0 !important;
}
/* note styles */
.note {
	position: absolute;
	width: 80px;
	height: 32px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	z-index: 10;
}
.note > img {
	width: 100%;
	height: auto;
}
.long-note {
	position: absolute;
	width: 70px;
	z-index: 9;
	transform-origin: 50% 100%;
}
.long-note > img {
	width: 100%;
	height: 100%;
}
.note-hold .note {
	min-height: 16px;
}
.note-head img {
  opacity: 0.6;
}
.note-selected {
	filter: drop-shadow(0 0 5px black);
}
/* play line */
.playline {
	position: fixed;
	left: 0;
	bottom: 113px;
	width: 100%;
	background-color: red;
	box-shadow: 0 0 3px 2px pink;
	height: 1px;
}
.playline > div {
	color: #E91E63;
	position: absolute;
	left: 880px;
	top: 0;
}
</style>