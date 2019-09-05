import config from '../config.js';
import game from '../index.js';
import judge from './judge.js';

const judgeRange = [40, 90, 110, 130];

let prejudge = function(time, pointer) {
	return judge(time - this.note.time, judgeRange) >= 0;
}

let realjudge = function(time, pointer) {
	let result = judge(time - this.note.time, judgeRange);
	if (result == -1) {
		result = config.JUDGE.MISS;
	} else {
		game.trackManager.playAnimationOnTrack(this.note.track, 'a_normal');
		if (result <= config.JUDGE.GOOD) {
			game.sound['se_judge' + result].play();
		}
	}
	game.scoreManager.judge(result);
	this.destroy();
}

let updateDisplay = function (time, start, end) {
	let w = start.x2 - start.x1;
	let scale = w / this.width * config.noteStyle.scale;
	this.setScale(scale * 1.2);
	if (start.y - this.displayHeight > config.height) {
		start.y = config.height + this.displayHeight;
	}
	this.setPosition(start.x1 + w / 2, start.y);

	if (this.note.skipjudge) {
		return;
	}
	// auto mode
	if (config.auto && time - this.note.time > -20) {
		this.judge(time, null);
	}
	// play mode
	if (time - this.note.time > judgeRange[3]) {
		this.judge(time, null);
	}
}

export default function (scene, note, slide) {
	if (slide) {
		if (slide == -1) {
			note = {
				track: note.track,
				time: note.time,
				skipjudge: true
			};
		} else {
			note = {
				track: note.endtrack,
				time: note.endtime,
				skipjudge: true
			};
		}
	}
	let sprite = scene.add.sprite(0, 0, (slide ? 'long_' : 'normal_') + note.track);
	sprite.setDepth(10);
	sprite.setOrigin(0.5, 0.5);
	sprite.updateDisplay = updateDisplay;
	sprite.note = note;
	sprite.prejudge = prejudge;
	sprite.judge = realjudge;
	return sprite;
};