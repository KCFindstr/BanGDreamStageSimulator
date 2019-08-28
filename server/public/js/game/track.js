import game from './index.js';
import config from './config.js';
import newNormalNote from './notes/normal.js';
import newFlickNote from './notes/flick.js';
import newLongNote from './notes/long.js';

let updateJudge = function() {
	this.dScale += this.ddScale;
	this.setScale(Math.min(0.8, this.dScale));
	if (this.dScale > 3 && this.ddScale > 0) {
		this.ddScale = -this.ddScale;
	}
	if (this.dScale < 0.4) {
		game.trackManager.judge = null;
		this.destroy();
	}
}

class TrackManager {
	constructor(scene) {
		this.scene = scene;
		this.hasStarted = false;
		this.visibleNotes = scene.add.group();
		this.head = 0;
		this.noteById = {};
		this.lineMap = {};
		for (let note of game.chart.notes) {
			this.noteById[note.id] = note;
		}
		this.trackPosition = [];
		for (let i=0; i<7; i++)
			this.trackPosition.push(this.getTrackPosition(i, 0));
	}

	playJudge(judge) {
		let sprite = this.scene.add.sprite(config.centerX, config.height - 180, 'judge_' + judge);
		sprite.setOrigin(0.5, 0.5);
		sprite.setDepth(20);
		sprite.dScale = 0.4;
		sprite.ddScale = 0.08;
		sprite.update = updateJudge;
		if (this.judge) {
			this.judge.destroy();
		}
		this.judge = sprite;
	}

	playAnimationOnTrack(trackid, name) {
		let start = this.trackPosition[trackid];
		let w = start.x2 - start.x1;
		let sprite = this.scene.add.sprite(start.x1 + w/2, start.y + 5, name);
		let scale = 2.5 * w / sprite.width * config.noteStyle.scale;
		sprite.setScale(scale);
		sprite.setDepth(5);
		sprite.setOrigin(0.5, 0.84);
		sprite.anims.play(name + '_play');
		sprite.on('animationcomplete', function() {
			sprite.destroy();
		});
	}

	getTrackPosition(trackid, pos) {
		if (pos == 0) {
			let ret = this.trackPosition[trackid];
			if (ret != undefined)
				return Object.assign({}, ret);
		}
		let track = game.bglane;
		let width = track.displayWidth;
		let height = track.displayHeight;
		let y = track.y;
		let w1 = width / 70 / 7;
		let w2 = width * 108 / 116 / 7;
		let posw = Math.exp(-pos * 4) * w2;
		let posh = (posw - w1) / (w2 - w1) * height + y;
		let posl = config.centerX + (trackid - 3.5) * posw;
		let posr = posl + posw;
		return {
			y: posh,
			x1: posl,
			x2: posr
		};
	}

	getTrackPositionByY(trackid, y) {
		let track = game.bglane;
		let width = track.displayWidth;
		let height = track.displayHeight;
		let tracky = track.y;
		let w1 = width / 70 / 7;
		let w2 = width * 108 / 116 / 7;
		let posw = w1 + (w2 - w1) * (y - tracky) / height;
		let posh = (posw - w1) / (w2 - w1) * height + y;
		let posl = config.centerX + (trackid - 3.5) * posw;
		let posr = posl + posw;
		return {
			y: posh,
			x1: posl,
			x2: posr
		};
	}

	getTrackByPosition(x, y) {
		if (y <= 400) {
			return -1;
		}
		let pos = this.getTrackPositionByY(0, y);
		let w = pos.x2 - pos.x1;
		pos.x1 -= w;
		pos.x2 -= w;
		for (let i=-1; i<=7; i++) {
			if (x >= pos.x1 && x < pos.x2) {
				if (i == -1)
					return 0;
				if (i == 7)
					return 6;
				return i;
			}
			pos.x1 += w;
			pos.x2 += w;
		}
		return -1;
	}

	getNoteById(id) {
		return this.noteById[id];
	}

	getPlayingPosition() {
		if (!this.hasStarted) {
			if (this.target == undefined) {
				this.target = this.scene.time.now + config.WAIT;
			}
			let result = this.scene.time.now - this.target;
			if (result >= 0) {
				game.bgm.play();
				game.bgm.once('end', () => {
					this.finish = this.scene.time.now;
				});
				this.hasStarted = true;
				return 0;
			}
			return Math.round(result);
		} else {
			if (this.finish != undefined)
				return Math.round(game.bgm.duration() * 1000 + this.scene.time.now - this.finish);
			else
				return Math.round(game.bgm.seek() * 1000);
		}
	}

	updateVisibleNotes() {
		let currentTime = this.getPlayingPosition();
		// console.log('update', currentTime);
		let notes = game.chart.notes;
		let newnotes = [];
		// Add new notes
		while (this.head < notes.length) {
			let cur = notes[this.head];
			if (cur.time >= currentTime + game.chart.range)
				break;
			this.head++;
			let newNote = null;
			switch (cur.type) {
				case config.NOTE.NORMAL:
					newNote = newNormalNote(this.scene, cur);
					break;
				case config.NOTE.FLICK:
					newNote = newFlickNote(this.scene, cur);
					break;
				case config.NOTE.SLIDE:
					newNote = newLongNote(this.scene, cur);
					break;
			}
			if (newNote) {
				newnotes.push(newNote);
				this.visibleNotes.add(newNote);
			}
		}
		// Update old notes
		for (let sprite of this.visibleNotes.getChildren()) {
			let note = sprite.note;
			let start = this.getTrackPosition(note.track, (note.time - currentTime) / game.chart.range);
			let end = null;
			if (note.endtime != undefined) {
				end = this.getTrackPosition(note.endtrack, (note.endtime - currentTime) / game.chart.range);
			}
			sprite.updateDisplay(currentTime, start, end);
		}
		// Update others
		if (this.judge) {
			this.judge.update();
		}
		// Multi touch hint
		let visible = {};
		let timemap = {};
		let addToMap = (t, x, y, id) => {
			if (!timemap[t]) {
				timemap[t] = [];
			}
			timemap[t].push([x, y, id]);
		};
		for (let sprite of this.visibleNotes.getChildren()) {
			let note = sprite.note;
			visible[note.id] = true;
			if (note.type == config.NOTE.SLIDE) {
				if (note.headtype != config.NOTE.SLIDE && !note.judged) {
					addToMap(note.time, sprite.head.x, sprite.head.y, note.id);
				}
				if (note.tailtype != config.NOTE.SLIDE && currentTime <= note.endtime) {
					addToMap(note.endtime, sprite.tail.x, sprite.tail.y, note.id);
				}
			} else {
				addToMap(note.time, sprite.x, sprite.y, note.id);
			}
		}
		let track = game.bglane;
		let height = track.displayHeight;
		let tracky = track.y;
		for (let t in timemap) {
			let arr = timemap[t];
			if (arr.length <= 1) continue;
			if (!this.lineMap[t]) {
				this.lineMap[t] = game.scene.add.line(0, 0, 0, 0, 0, 0, 0xffffff, 1);
				this.lineMap[t].setDepth(6);
			}
			let maxx = -1e9, minx = 1e9, maxid, minid, y = 0;
			for (let data of arr) {
				if (data[0] > maxx) {
					maxx = data[0];
					maxid = data[2];
				}
				if (data[0] < minx) {
					minx = data[0];
					minid = data[2];
				}
				y = data[1];
			}
			let line = this.lineMap[t];
			let ratio = (y - tracky) / height;
			line.setTo(minx, y, maxx, y);
			line.setLineWidth(5 * config.noteStyle.scale * ratio);
			line.ids = [minid, maxid];
		}
		for (let t in this.lineMap) {
			let line = this.lineMap[t];
			if (!visible[line.ids[0]] || !visible[line.ids[1]]) {
				line.destroy();
				delete this.lineMap[t];
			}
		}
	}
};

export default TrackManager;