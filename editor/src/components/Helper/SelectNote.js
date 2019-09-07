
// select a note
import Cache from './Cache';
import Vue from 'vue';

export default function(note) {
	if (Cache.noteHead) {
		Cache.noteHead = null;
	}
	let noteList = [note];
	let cur = note;
	let map = Cache.noteMap;
	// hold notes
	while (cur.next) {
		cur = map[cur.next];
		noteList.push(cur);
	}
	cur = note;
	while (cur.prev) {
		cur = map[cur.prev];
		noteList.push(cur);
	}
	// add / remove selection
	for (cur of noteList) {
		if (!Cache.selectedNotes[cur.id]) {
			Vue.set(Cache.selectedNotes, cur.id, cur);
		} else {
			Vue.delete(Cache.selectedNotes, cur.id);
		}
	}
}