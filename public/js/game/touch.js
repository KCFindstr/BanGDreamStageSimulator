import game from './index.js';
import config from './config.js';

let pointerDownListener = function(pointer) {
	let track = game.trackManager.getTrackByPosition(pointer.x, pointer.y);
	if (track == -1)
		return;
	let notes = game.trackManager.visibleNotes;
	let currrentTime = game.trackManager.getPlayingPosition();
	let mintime = 1e9;
	let tojudge = null;
	for (let note of notes.getChildren()) {
		let diff = Math.abs(note.note.time - currrentTime);
		let trackdiff = Math.abs(track - note.note.track);
		if (diff > mintime || note.judged || trackdiff > 1)
			continue;
		if (diff == mintime && trackdiff > 0)
			continue;
		if (note.prejudge(currrentTime, pointer)) {
			tojudge = note;
			mintime = diff;
		}
	}
	if (tojudge) {
		tojudge.judge(currrentTime, pointer);
	} else {
		game.sound['se_touch'].play();
	}
}

let pointerUpListener = function(pointer) {
	let note = game.touchManager.isOccupied(pointer.id)[1];
	let currrentTime = game.trackManager.getPlayingPosition();
	if (note && note.onrelease) {
		note.onrelease(currrentTime, pointer);
	}
	game.touchManager.release(pointer.id);
}

class TouchManager {
	constructor(scene) {
		this.scene = scene;
		this.occupied = {};
		this.callback = {};
		this.reverse = {};
		if (!config.auto) {
			scene.input.on('pointerdown', pointerDownListener);
			scene.input.on('pointerup', pointerUpListener);
		}
	}

	occupy(id, obj, callback) {
		this.occupied[id] = obj;
		this.callback[id] = callback;
		this.reverse[obj] = id;
	}

	release(id) {
		this.reverse[this.occupied[id]] = null;
		this.occupied[id] = null;
		this.callback[id] = null;
	}

	isOccupied(id) {
		return [this.occupied[id], this.callback[id]];
	}

	getPointerByOccupy(obj) {
		let id = this.reverse[obj];
		if (id != null)
			return this.scene.input.manager.pointers[id];
		return null;
	}
};

export default TouchManager;