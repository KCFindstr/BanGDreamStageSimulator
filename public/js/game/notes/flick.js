import config from '../config.js';
import game from '../index.js';
import judge from './judge.js';

const judgeRange = [40, 90, 110, 130];
const judgewait = 100;

let onrelease = function () {
	this.startjudge(config.JUDGE.MISS);
}

let prejudge = function(time, pointer) {
	return judge(time - this.note.time, judgeRange) >= 0;
}

let realjudge = function(time, pointer) {
	this.judged = pointer;
	let result = judge(time - this.note.time, judgeRange);
	if (result == -1) {
		result = config.JUDGE.MISS;
		this.startjudge(result);
	} else {
		game.touchManager.occupy(pointer.id, this.note.poolId, this);
		this.judgeresult = result;
	}
}

let startjudge = function(result) {
	if (result != config.JUDGE.MISS) {
		game.trackManager.playAnimationOnTrack(this.note.track, 'a_flick');
	}
	if (result <= config.JUDGE.GOOD) {
		game.sound['se_flick'].play();
	}
	game.scoreManager.judge(result);
	this.children.destroy();
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
	this.children.updateTop(time, start);

	if (this.note.skipjudge) {
		return;
	}

	// pressed, waiting for slide
	if (this.judged) {
		let pointer = this.judged;
		if (pointer.x == undefined) {
			// auto mode
			if (time - this.note.time > 0) {
				this.startjudge(this.judgeresult);
			}
		} else {
			if (pointer.getDistance() >= config.flickDistance) {
				this.startjudge(this.judgeresult);
				game.touchManager.release(pointer.id);
			}
			else if (pointer.getDuration() > judgewait) {
				this.startjudge(config.JUDGE.MISS);
			}
		}
		return;
	}

	// auto
	if (config.auto && time - this.note.time > -20) {
		this.judge(time, {id: 1});
	}
	// play
	if (time - this.note.time > judgeRange[3]) {
		this.startjudge(config.JUDGE.MISS);
	}
}

let updateTop = function(time, start) {
	let w = start.x2 - start.x1;
	let scale = w / this.width * config.noteStyle.scale;
	this.setScale(scale * 0.9);
	if (start.y - this.displayHeight > config.height) {
		start.y = config.height + this.displayHeight;
	}
	this.setPosition(start.x1 + w / 2, start.y - this.dDy * scale);
	this.dDy = (this.dDy + 1) % 30;
}

export default function (scene, note) {
	if (note.type == config.NOTE.SLIDE) {
		note = {
			track: note.endtrack,
			time: note.endtime,
			skipjudge: true
		};
	}
	let sprite = scene.add.sprite(0, 0, 'flick_' + note.track);
	sprite.setDepth(10);
	sprite.setOrigin(0.5, 0.5);
	sprite.updateDisplay = updateDisplay;
	sprite.note = note;
	sprite.children = scene.add.sprite(0, 0, 'flick_top');
	sprite.children.updateTop = updateTop;
	sprite.children.dDy = 0;
	sprite.children.setDepth(11);
	sprite.children.setOrigin(0.5, 0.8);
	sprite.prejudge = prejudge;
	sprite.judge = realjudge;
	sprite.startjudge = startjudge;
	sprite.onrelease = onrelease;
	return sprite;
};