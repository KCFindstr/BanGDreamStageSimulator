let earlyThan = function (t1, t2) {
	return timeDiff(t1, t2, 60) < 0;
}

let timeDiff = function (t1, t2, bpm) {
	t1 = t1[0] + t1[1] / t1[2];
	t2 = t2[0] + t2[1] / t2[2];
	return (t1 - t2) * 60 / bpm;
}

let poolId;

let assginPoolId = function(note, notes) {
	if (note.poolId)
		return note.poolId;
	if (note.next) {
		return note.poolId = assginPoolId(notes[note.next], notes);
	} else {
		return note.poolId = ++poolId;
	}
}

export default function (chart) {
	let notes = chart.notes;
	// Get and sort all notes
	let timelist = [];
	for (let note of notes) {
		timelist.push(note.time);
		if (note.endtime) {
			timelist.push(note.endtime);
		}
	}
	timelist.sort((a, b) => timeDiff(a, b, 60));

	// Compute time
	let bpmlist = chart.bpm;
	let time = 0;
	let bpm = 1;
	let bpmpos = 0;
	let bpmstart = [1, 0, 1];
	for (let note of timelist) {
		while (bpmpos < bpmlist.length && earlyThan(bpmlist[bpmpos].time, note)) {
			// Update bpm
			let cur = bpmlist[bpmpos];
			time += timeDiff(bpmstart, cur.time, bpm);
			bpm = cur.value;
			bpmstart = cur.time;
			bpmpos++;
		}

		note[0] = Math.round((time + timeDiff(note, bpmstart, bpm)) * 1000 - chart.offset);
	}

	// Modify notes
	let notemap = {};
	for (let note of notes) {
		notemap[note.id] = note;
		note.time = note.time[0];
		if (note.endtime) {
			note.endtime = note.endtime[0];
		}
	}

	// assign pool id
	poolId = 0;
	for (let note of notes) {
		assginPoolId(note, notemap);
	}

	notes.sort((a, b) => a.time - b.time);
}