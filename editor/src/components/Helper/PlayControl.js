import Cache from './Cache';
import Data from './Data';
import TrackEditor from './Track';

export default function(play) {
	if (!Cache.music) return;
	if (!play) {
		if (Cache.music.playing()) {
			play = -1;
		} else {
			play = 1;
		}
	}
	if (play == 1) {
		if (Cache.music.playing())
			return;
		let pos = Cache.music.seek();
		Cache.timeline = [];
		Cache.head = 0;
		let timeline = Cache.timeline;
		for (let note of Data.notes) {
			if (note.type == 2) {
				let st = TrackEditor.getTimeInSeconds(note.time);
				if (st >= pos) {
					timeline.push({time: st, type: note.headtype});
				}
				st = TrackEditor.getTimeInSeconds(note.endtime);
				if (note.tailtype != 2 && st >= pos) {
					timeline.push({time: st, type: note.tailtype});
				}
			} else {
				let st = TrackEditor.getTimeInSeconds(note.time);
				if (st >= pos) {
					timeline.push({time: st, type: note.type});
				}
			}
		}
		timeline.sort((a, b) => a.time - b.time);
		Cache.music.play();
		Cache.playState = 0;
	} else {
		if (!Cache.music.playing())
			return;
		Cache.music.pause();
		Cache.playState = 1;
	}
}