import removeAllSelection from './RemoveSelection';
import ChangeTool from './ChangeTool';
import PlayControl from './PlayControl';
import Data from './Data';
import Cache from './Cache';

function pressedDelete() {
	removeAllSelection(true);
}

// Key event listener
function adjustTime(oritime, key) {
	let div = Data.editor.division;
	let time = [...oritime];
	if (key == 0) {
		for (let i = 0; i < div; i++) {
			if (i * time[2] > time[1] * div) {
				time[1] = i;
				time[2] = div;
				return time;
			}
		}
		if (time[0] >= Data.editor.maxrow) {
			return time;
		}
		time[0]++;
		time[1] = 0;
		time[2] = div;
	} else {
		for (let i = div - 1; i >= 0; i--) {
			if (i * time[2] < time[1] * div) {
				time[1] = i;
				time[2] = div;
				return time;
			}
		}
		if (time[0] <= 1) {
			return time;
		}
		time[0]--;
		time[1] = div - 1;
		time[2] = div;
	}
	return time;
}

function adjustTrack(note, prop, key) {
	let res = note[prop] + (key == 2 ? -1: 1);
	res = Math.max(0, Math.min(6, res));
	note[prop] = res;
}

function pressedKey(event, key) {
	let keys = Object.keys(Cache.selectedNotes);
	if (keys.length == 0) return;
	event.preventDefault();
	for (let id of keys) {
		let note = Cache.selectedNotes[id];
		if (key < 2) {
			note.time = adjustTime(note.time, key);
			if (note.endtime) {
				note.endtime = adjustTime(note.endtime, key);
			}
		} else {
			adjustTrack(note, 'track', key);
			if (note.endtrack != undefined) {
				adjustTrack(note, 'endtrack', key);
			}
		}
	}
}

export default function(event) {
	switch (event.key) {
		case 'ArrowUp': pressedKey(event, 0); break;
		case 'ArrowDown': pressedKey(event, 1); break;
		case 'ArrowLeft': pressedKey(event, 2); break;
		case 'ArrowRight': pressedKey(event, 3); break;
		case 'Delete': pressedDelete(); break;
		case ' ': event.preventDefault(); PlayControl(); break;
		case 'a': ChangeTool(0); break;
		case 's': ChangeTool(1); break;
		case 'd': ChangeTool(2); break;
		case 'f': ChangeTool(3); break;
		case '1': ChangeTool(0); break;
		case '2': ChangeTool(1); break;
		case '3': ChangeTool(2); break;
		case '4': ChangeTool(3); break;
	}
}