import config from '../config.js';
import game from '../index.js';

let updateDisplay = function (time, start, end) {
	let w = start.x2 - start.x1;
	let scale = w / this.width * config.noteStyle.scale;
	this.setScale(scale * 1);
	if (start.y - this.displayHeight > config.height) {
		start.y = config.height + this.displayHeight;
	}
	this.setPosition(start.x1 + w / 2, start.y);
}

export default function (scene, note) {
	let sprite = scene.add.sprite(0, 0, 'long_slide');
	sprite.setDepth(10);
	sprite.setOrigin(0.5, 0.5);
	sprite.updateDisplay = updateDisplay;
	sprite.note = note;
	return sprite;
};