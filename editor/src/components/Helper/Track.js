import Cache from './Cache';
import Data from './Data';
import Vue from 'vue';
import syncScrollbar from './SyncScrollbar';

class TrackEditor {

	static earlyThan(t1, t2) {
		return this.timeDiff(t1, t2, 60) < 0;
	}
	
	static timeDiff(t1, t2, bpm) {
		if (typeof(t1) != 'number')
			t1 = t1[0] + t1[1] / t1[2];
		if (typeof(t2) != 'number')
			t2 = t2[0] + t2[1] / t2[2];
		return (t1 - t2) * 60 / bpm;
	}

	static updateBpm(newbpm) {
		if (Cache.music.playing()) {
			Cache.music.pause();
		}
		if (newbpm) {
			newbpm.sort((a, b) => this.getTime(a.time) - this.getTime(b.time));
			Data.bpm.splice(0, Data.bpm.length);
			for (let bpm of newbpm) {
				Data.bpm.push({
					value: bpm.value,
					time: [bpm.time[0], bpm.time[1], bpm.time[2]]
				});
			}
		} else {
			newbpm = Data.bpm;
		}
		let duration = Cache.music.duration() + Data.offset / 1000;
		for (let i=1; i<newbpm.length; i++) {
			let len = this.getTime(newbpm[i].time) - this.getTime(newbpm[i-1].time);
			len *= 60 / newbpm[i-1].value;
			duration -= len;
		}
		let lastbpm = newbpm[newbpm.length - 1];
		let ans = 8 + lastbpm.time[0];
		if (duration > 0) {
			ans += duration / (60 / lastbpm.value);
		}
		ans = parseInt(ans);
		Data.editor.maxrow = ans;
		Vue.nextTick(() => {
			syncScrollbar(Cache.music.seek());
		});
	}

	static init() {
		for (let i in Cache.noteMap) {
			let note = Cache.noteMap[i];
			delete Cache.noteData[note.id];
			delete Cache.noteMap[note.id];
		}
		for (let note of Data.notes) {
			Cache.noteMap[note.id] = note;
			Cache.noteData[note.id] = {};
		}
	}

	static removeNote(id) {
		let note = Cache.noteMap[id];
		if (!note) return;
		if (note.prev && note.next) {
			Cache.noteMap[note.prev].next = 0;
			Cache.noteMap[note.prev].tailtype = 0;
			Cache.noteMap[note.next].prev = 0;
			Cache.noteMap[note.next].headtype = 0;
		} else if (note.next) {
			Cache.noteMap[note.next].prev = 0;
			Cache.noteMap[note.next].headtype = note.headtype;
		} else if (note.prev) {
			Cache.noteMap[note.prev].next = 0;
			Cache.noteMap[note.prev].tailtype = note.tailtype;
		}
		let index = Data.notes.indexOf(note);
		Data.notes.splice(index, 1);
		delete Cache.noteMap[id];
		delete Cache.noteData[id];
	}

	static getNoteData(id) {
		return Cache.noteData[id];
	}

	static getNoteById(id) {
		return Cache.noteMap[id];
	}

	static makeNote(obj) {
		obj.id = ++Data.editor.noteId;
		Cache.noteMap[obj.id] = obj;
		Cache.noteData[obj.id] = {};
		Data.notes.push(obj);
	}

	static getTime(time) {
		return time[0] + time[1] / time[2];
	}

	static getEndNote(note) {
		return {
			track: note.endtrack,
			time: note.endtime,
			type: note.tailtype
		};
	}

	static getFileByNoteType(type, ishold) {
		if (!ishold) {
			switch (type) {
				case 0: return 'img/note_normal.png';
				case 1: return 'img/note_flick.png';
				case 2: return 'img/note_slide_among.png';
				default: return 'img/long_note_line.png';
			}
		}
		switch (type) {
			case 0: return 'img/note_long.png';
			case 1: return 'img/note_flick.png';
			default: return 'img/note_slide_among.png';
		}
	}

	static loadChart(chart) {
		Data.notes.splice(0, Data.notes.length);
		for (let note of chart.notes) {
			Data.notes.push(note);
		}
		Data.bpm.splice(0, Data.bpm.length);
		for (let bpm of chart.bpm) {
			Data.bpm.push(bpm);
		}
		Object.assign(Data.meta, chart.meta);
		Object.assign(Data.editor, chart.editor);
		Data.offset = chart.offset;
		this.init();
		this.updateBpm();
	}

	static getTimeInSeconds(time) {
		let ret = 0;
		for (let i=1; i<Data.bpm.length; i++) {
			let bpm = Data.bpm[i];
			if (this.earlyThan(bpm.time, time)) {
				ret += this.timeDiff(bpm.time, Data.bpm[i-1].time, Data.bpm[i-1].value);
			} else {
				ret += this.timeDiff(time, Data.bpm[i-1].time, Data.bpm[i-1].value);
				return ret;
			}
		}
		let lastbpm = Data.bpm[Data.bpm.length - 1];
		ret += this.timeDiff(time, lastbpm.time, lastbpm.value);
		return ret;
	}

	static getTimeBySeconds(seconds) {
		let curt = 1;
		for (let i=1; i<Data.bpm.length; i++) {
			let bpm = Data.bpm[i];
			let add = this.timeDiff(bpm.time, Data.bpm[i-1].time, Data.bpm[i-1].value);
			if (add < seconds) {
				seconds -= add;
				curt = this.getTime(bpm.time);
				continue;
			}
			curt += seconds / (60 / Data.bpm[i-1].value);
			return curt;
		}
		let lastbpm = Data.bpm[Data.bpm.length - 1];
		curt += seconds / (60 / lastbpm.value);
		return curt;
	}
}

export default TrackEditor;