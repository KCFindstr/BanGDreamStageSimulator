import loader from './loader.js';

let obj = {
	liveId: 2,
	songId: 1,
	auto: false,
	parent: 'game-main',
	type: Phaser.AUTO,
	width: 1280,
	height: 720,
	centerX: 0,
	centerY: 0,
	scene: loader,
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH
	},
	input: {
		activePointers: 7,
	},
	noteStyle: {
		flick: 0,
		long: 0,
		normal: 0,
		se: 0,
		line: 0,
		scale: 1.5
	},
	flickDistance: 1,
	speed: 10,
	NOTE: {
		NORMAL: 0,
		FLICK: 1,
		SLIDE: 2,
	},
	JUDGE: {
		PERFECT: 0,
		GREAT: 1,
		GOOD: 2,
		BAD: 3,
		MISS: 4
	},
	WAIT: 1000,
	MAXRANGE: 10000
};
obj.centerX = obj.width / 2;
obj.centerY = obj.height / 2;

export default obj;