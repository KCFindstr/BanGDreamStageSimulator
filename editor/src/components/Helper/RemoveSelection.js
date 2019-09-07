import Cache from './Cache';
import Vue from 'vue';
import TrackEditor from './Track';

export default function(real) {
	let list = Object.keys(Cache.selectedNotes);
	if (list.length == 0)
		return false;
	for (let id of list) {
		if (real) {
			TrackEditor.removeNote(id);
		}
		Vue.delete(Cache.selectedNotes, id);
	}
	return true;
}