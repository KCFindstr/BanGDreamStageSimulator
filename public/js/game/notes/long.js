import config from '../config.js';
import game from '../index.js';
import judge from './judge.js';
import newNormalNote from './normal.js';
import newFlickNote from './flick.js';
import newSlideNote from './slide.js';

const judgeRange = [40, 90, 110, 130];
const tailRange = [60, 110, 130, 150];
const flickRange = 100;
const slideRange = 200;

let onrelease = function (time, pointer) {
	let note = this.note;
	if (note.tailtype != config.NOTE.NORMAL) {
		this.tailjudge(config.JUDGE.MISS);
		return;
	}
	let track = game.trackManager.getTrackByPosition(pointer.x, pointer.y);
	if (track == -1 || Math.abs(note.endtrack - track) > 1) {
		this.tailjudge(config.JUDGE.MISS);
		return;
	}
	let result = judge(time - note.endtime, tailRange);
	if (result == -1) {
		result = config.JUDGE.MISS;
	}
	this.tailjudge(result);
}

let headjudge = function(result) {
	// console.log('head judge: ' + this.note.id + ' / ' + result);
	let judgeSuccess = this.note.headtype == config.NOTE.NORMAL || result != config.JUDGE.MISS;
	if (judgeSuccess && result != config.JUDGE.MISS) {
		// normal note, or successful slide
		game.trackManager.playAnimationOnTrack(this.note.track, 'a_normal');
	}
	if (result <= config.JUDGE.GOOD) {
		// good result, play se
		game.sound['se_judge' + result].play();
	}
	this.head.judged = true;
	if (judgeSuccess) {
		// normal note, or successful slide
		game.sound['se_tap'].play(game.tapse);
		game.scoreManager.judge(result);
	}
}

let tailjudge = function(result) {
	// console.log('tail judge: ' + this.note.id + ' / ' + result);
	let note = this.note;
	if (result != config.JUDGE.MISS) {
		if (note.tailtype == config.NOTE.FLICK) {
			game.trackManager.playAnimationOnTrack(this.note.endtrack, 'a_flick');
		} else if (note.tailtype == config.NOTE.NORMAL) {
			game.trackManager.playAnimationOnTrack(this.note.endtrack, 'a_normal');
		}
	}
	if (result <= config.JUDGE.GOOD) {
		if (note.tailtype == config.NOTE.FLICK) {
			game.sound['se_flick'].play();
		} else if (note.tailtype == config.NOTE.NORMAL) {
			game.sound['se_judge' + result].play();
		}
	}
	if (result == config.JUDGE.MISS || note.tailtype != config.NOTE.SLIDE) {
		game.sound['se_tap'].stop();
		game.scoreManager.judge(result);
		if (this.judged) {
			game.touchManager.release(this.judged.id);
		}
	}
	this.head.destroy();
	if (this.tail) {
		if (this.tail.children) {
			this.tail.children.destroy();
		}
		this.tail.destroy();
	}
	if (this.trackeffect) {
		this.trackeffect.destroy();
	}
	this.destroy();
	this.destroyed = true;
}

let prejudge = function(time, pointer) {
	if (game.touchManager.getPointerByOccupy(this.note.poolId))
		return false;
	return judge(time - this.note.time, judgeRange) >= 0;
}

let realjudge = function(time, pointer) {
	this.judged = pointer;
	let result = judge(time - this.note.time, judgeRange);
	if (result == -1) {
		result = config.JUDGE.MISS;
	}
	if (this.note.headtype == config.NOTE.SLIDE) {
		result = config.JUDGE.MISS;
	}
	if (pointer.x) {
		game.touchManager.occupy(pointer.id, this.note.poolId, this);
	}
	this.headjudge(result);
}

let updateDisplay = function (time, start, end) {
	let note = this.note;
	if (time >= note.time) {
		// this note becomes active
		let poolPointer = game.touchManager.getPointerByOccupy(note.poolId);
		if (poolPointer && !this.judged) {
			this.judged = poolPointer;
			game.touchManager.occupy(poolPointer.id, note.poolId, this);
		}
	}
	if (this.judged) {
		// check head type
		if (!this.head.judge) {
			let judged = this.head.judged;
			this.head.destroy();
			this.head = newNormalNote(game.scene, note, -1);
			this.head.judged = judged;
		}
		// display head on play line
		let playline = game.trackManager.getTrackPosition(this.note.track, 0);
		let ratio =  (playline.y - end.y) / (start.y - end.y);
		start.y = end.y + (start.y - end.y) * ratio;
		start.x1 = end.x1 + (start.x1 - end.x1) * ratio;
		start.x2 = end.x2 + (start.x2 - end.x2) * ratio;
		if (end.y >= start.y) {
			// if tail does not judge
			if (note.tailtype == config.NOTE.SLIDE) {
				this.tailjudge(config.JUDGE.PERFECT);
				return;
			}
			start = game.trackManager.getTrackPosition(this.note.endtrack, 0);
			end = start;
		}
		// effect
		let mid = (start.x2 + start.x1) / 2;
		if (!this.trackeffect) {
			let sprite = this.scene.add.sprite(mid, start.y, 'a_hold');
			sprite.setDepth(5);
			sprite.setOrigin(0.5, 0.84);
			sprite.anims.play('a_hold_play');
			this.trackeffect = sprite;
		}
	}
	let ws = start.x2 - start.x1;
	let we = end.x2 - end.x1;
	let mids = start.x1 + ws / 2;
	let mide = end.x1 + we / 2;

	let sx1 = mids - ws / 2 * config.noteStyle.scale * 0.9;
	let sx2 = mids + ws / 2 * config.noteStyle.scale * 0.9;
	let ex1 = mide - we / 2 * config.noteStyle.scale * 0.9;
	let ex2 = mide + we / 2 * config.noteStyle.scale * 0.9;

	this.setBottomLeft(sx1, start.y);
	this.setBottomRight(sx2, start.y);
	this.setTopLeft(ex1, end.y);
	this.setTopRight(ex2, end.y);
	if (this.trackeffect) {
		let sprite = this.trackeffect;
		sprite.setPosition(mids, start.y + 5);
		sprite.setScale(2 * ws / sprite.width * config.noteStyle.scale);
	}

	// head must exist
	this.head.updateDisplay(time, start);
	if (!this.head.judged) {
		// not judged
		if (note.headtype == config.NOTE.NORMAL) {
			// Auto
			if (config.auto && time - note.time > -20) {
				this.headjudge(config.JUDGE.PERFECT);
				this.judged = {id: 1};
			}
			// too late
			else if (time - note.time > judgeRange[3]) {
				this.headjudge(config.JUDGE.MISS);
				this.tailjudge(config.JUDGE.MISS);
				return;
			}
		} else {
			// Auto
			if (config.auto && time - note.time > -20) {
				this.headjudge(config.JUDGE.PERFECT);
				this.judged = {id: 1};
			}
			// slide
			else if (time - note.time > slideRange) {
				this.tailjudge(config.JUDGE.MISS);
				return;
			}
			else if (this.judged) {
				let track = game.trackManager.getTrackByPosition(this.judged.x, this.judged.y);
				if (track >= 0 && Math.abs(track - note.track) <= 1) {
					this.headjudge(config.JUDGE.PERFECT);
				}
			}
		}
	}

	// tail may not exist
	if (this.tail) {
		this.tail.updateDisplay(time, end);
		if (!this.tail.judged && this.head.judged) {
			// Auto
			if (config.auto && time - note.endtime > -20) {
				this.tailjudge(config.JUDGE.PERFECT);
			}
			// miss
			else if (time > note.endtime + tailRange[3]) {
				this.tailjudge(config.JUDGE.MISS);
				return;
			}
			else if (note.tailtype == config.NOTE.FLICK) {
				// flick tail
				if (time >= note.endtime) {
					this.tail.judged = {
						x: this.judged.x,
						y: this.judged.y,
						t: time
					};
				}
			}
		}
		if (this.tail.judged) {
			if (time > this.tail.judged.time + flickRange) {
				this.tailjudge(config.JUDGE.MISS);
				return;
			}
			let dx = this.judged.x - this.tail.judged.x;
			let dy = this.judged.y - this.tail.judged.y;
			let d = Math.sqrt(dx * dx + dy * dy);
			if (d >= config.flickDistance) {
				this.tailjudge(config.JUDGE.PERFECT);
			}
		}
	}
}

export default function (scene, note) {
	let sprite = scene.add.quad(0, 0, 'long_line');
	sprite.setDepth(9);
	sprite.updateDisplay = updateDisplay;
	sprite.note = note;
	switch (note.headtype) {
		case config.NOTE.NORMAL:
			sprite.head = newNormalNote(scene, note, -1);
			break;
		case config.NOTE.SLIDE:
			sprite.head = newSlideNote(scene, note);
			break;
	}
	switch (note.tailtype) {
		case config.NOTE.NORMAL:
			sprite.tail = newNormalNote(scene, note, 1);
			break;
		case config.NOTE.FLICK:
			sprite.tail = newFlickNote(scene, note);
			break;
	}
	sprite.prejudge = prejudge;
	sprite.judge = realjudge;
	sprite.onrelease = onrelease;
	sprite.headjudge = headjudge;
	sprite.tailjudge = tailjudge;
	return sprite;
};