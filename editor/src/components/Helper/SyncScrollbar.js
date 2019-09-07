import Data from './Data';
import Cache from './Cache';
import TrackEditor from './Track';
import Scroll from './Scroll';

let flick = new Howl({
	src: '/se/flick.wav',
	preload: true
});
let tap = new Howl({
	src: '/se/perfect.wav',
	preload: true
});
let html = document.scrollingElement;

export default function(musictime) {
	let pos = musictime + Data.offset / 1000;
	let timeline = Cache.timeline;
	while (Cache.head < timeline.length && pos >= timeline[Cache.head].time) {
		if (Data.editor.soundeffect) {
			if (timeline[Cache.head].type == 1) {
				flick.play();
			} else {
				tap.play();
			}
		}
		Cache.head++;
	}
	let time = TrackEditor.getTimeBySeconds(pos) - 1;
	Scroll(html.scrollHeight - $(window).outerHeight() - time * Data.editor.rowheight);
}