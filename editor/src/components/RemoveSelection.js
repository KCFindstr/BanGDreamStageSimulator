import Cache from './Cache';
import Vue from 'vue';

export default function() {
	let list = Object.keys(Cache.selectedNotes);
	if (list.length == 0)
		return false;
	for (let id of list)
		Vue.delete(Cache.selectedNotes, id);
	return true;
}