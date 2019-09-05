import config from './config.js';
import gameScene from './scene.js';
import coverScene from './cover.js';
import scoreScene from './scoreboard.js';
import game from './index.js';

let audioLoaded = 0;
let audioCount = 0;

export default {
	preload: function () {
		// progress bars
		// background
		let loadSprite = this.add.rectangle(config.centerX, config.centerY, 0, 20, 0xffffff);
		loadSprite.setOrigin(0.5, 0.5);
		// text
		let style = {
			fontSize: '32px',
			fill: '#fff',
			align: 'center',
		};
		let text = this.add.text(config.width/2, config.height/2 - 50, 'LOADING... 0%', style);
		text.setOrigin(0.5, 0.5);
		// Audio progress
		let audioSet = [
			['se_flick', `/static/se/${config.noteStyle.se}/flick.wav`, 0.6],
			['se_tap', `/static/se/${config.noteStyle.se}/tap.wav`, 1],
			['se_touch', `/static/se/${config.noteStyle.se}/touch.wav`, 0.6],
			['se_judge0', `/static/se/${config.noteStyle.se}/perfect.wav`, 0.6],
			['se_judge1', `/static/se/${config.noteStyle.se}/great.wav`, 0.6],
			['se_judge2', `/static/se/${config.noteStyle.se}/good.wav`, 0.6],
			['bgm', `/static/audio/${config.songId}/song.mp3`, 1, true],
		];
		audioCount = audioSet.length;
		// show progress bar
		this.load.on('progress', function (progress) {
			progress = progress * 0.6 + audioLoaded / audioCount * 0.4;
			loadSprite.setSize((config.width - 200) * progress, 20);
			loadSprite.setOrigin(0.5, 0.5);
			if (progress < 100)
				text.text = 'LOADING... ' + parseInt(progress * 100) + '%';
			else
				text.text = 'READY!';
		}, this);
		// load resources
		let imageSet = [
			['bg_normal', `/static/img/game/live_normal.png`],
			['bg_lanes', `/static/img/game/bg_line_rhythm_1.png`],
			['game_lane_0', `/static/img/game/lane_1.png`],
			['game_lane_1', `/static/img/game/lane_2.png`],
			['game_lane_2', `/static/img/game/lane_3.png`],
			['game_lane_3', `/static/img/game/lane_4.png`],
			['game_line', `/static/img/line/${config.noteStyle.line}/game_play_line.png`],
			['flick_top', `/static/img/flick/${config.noteStyle.flick}/note_flick_top.png`],
			['flick_0', `/static/img/flick/${config.noteStyle.flick}/note_flick_0.png`],
			['flick_1', `/static/img/flick/${config.noteStyle.flick}/note_flick_1.png`],
			['flick_2', `/static/img/flick/${config.noteStyle.flick}/note_flick_2.png`],
			['flick_3', `/static/img/flick/${config.noteStyle.flick}/note_flick_3.png`],
			['flick_4', `/static/img/flick/${config.noteStyle.flick}/note_flick_4.png`],
			['flick_5', `/static/img/flick/${config.noteStyle.flick}/note_flick_5.png`],
			['flick_6', `/static/img/flick/${config.noteStyle.flick}/note_flick_6.png`],
			['long_line', `/static/img/long/${config.noteStyle.long}/long_note_line.png`],
			['long_0', `/static/img/long/${config.noteStyle.long}/note_long_0.png`],
			['long_1', `/static/img/long/${config.noteStyle.long}/note_long_1.png`],
			['long_2', `/static/img/long/${config.noteStyle.long}/note_long_2.png`],
			['long_3', `/static/img/long/${config.noteStyle.long}/note_long_3.png`],
			['long_4', `/static/img/long/${config.noteStyle.long}/note_long_4.png`],
			['long_5', `/static/img/long/${config.noteStyle.long}/note_long_5.png`],
			['long_6', `/static/img/long/${config.noteStyle.long}/note_long_6.png`],
			['long_slide', `/static/img/long/${config.noteStyle.long}/note_slide_among.png`],
			['normal_0', `/static/img/normal/${config.noteStyle.normal}/note_normal_0.png`],
			['normal_1', `/static/img/normal/${config.noteStyle.normal}/note_normal_1.png`],
			['normal_2', `/static/img/normal/${config.noteStyle.normal}/note_normal_2.png`],
			['normal_3', `/static/img/normal/${config.noteStyle.normal}/note_normal_3.png`],
			['normal_4', `/static/img/normal/${config.noteStyle.normal}/note_normal_4.png`],
			['normal_5', `/static/img/normal/${config.noteStyle.normal}/note_normal_5.png`],
			['normal_6', `/static/img/normal/${config.noteStyle.normal}/note_normal_6.png`],
			['judge_0', `/static/img/game/judge_0.png`],
			['judge_1', `/static/img/game/judge_1.png`],
			['judge_2', `/static/img/game/judge_2.png`],
			['judge_3', `/static/img/game/judge_3.png`],
			['judge_4', `/static/img/game/judge_4.png`],
			['n_lg_0', `/static/img/game/bang_large_0.png`],
			['n_lg_1', `/static/img/game/bang_large_1.png`],
			['n_lg_2', `/static/img/game/bang_large_2.png`],
			['n_lg_3', `/static/img/game/bang_large_3.png`],
			['n_lg_4', `/static/img/game/bang_large_4.png`],
			['n_lg_5', `/static/img/game/bang_large_5.png`],
			['n_lg_6', `/static/img/game/bang_large_6.png`],
			['n_lg_7', `/static/img/game/bang_large_7.png`],
			['n_lg_8', `/static/img/game/bang_large_8.png`],
			['n_lg_9', `/static/img/game/bang_large_9.png`],
			['combo', `/static/img/game/bang_combo.png`],
		];

		let sheetSet = [
			['a_hold', `/static/img/long/${config.noteStyle.long}/slide.png`, {
				frameWidth: 250,
				frameHeight: 450,
				startFrame: 0,
				endFrame: 119
			}],
			['a_normal', `/static/img/normal/${config.noteStyle.normal}/normal.png`, {
				frameWidth: 375,
				frameHeight: 450,
				startFrame: 0,
				endFrame: 48
			}],
			['a_flick', `/static/img/flick/${config.noteStyle.flick}/flick.png`, {
				frameWidth: 375,
				frameHeight: 450,
				startFrame: 0,
				endFrame: 34
			}],
		];

		// images
		for (let desc of imageSet) {
			this.load.image(...desc);
		}
		// spritesheet
		for (let desc of sheetSet) {
			this.load.spritesheet(...desc);
		}
		// audio
		for (let desc of audioSet) {
			let sound = new Howl({
				src: desc[1],
				preload: true,
				volume: desc[2],
				html5: desc[3],
				onload: () => audioLoaded++,
			});
			game.sound[desc[0]] = sound;
		}
		// bitmap font
		this.load.bitmapFont('f_large', '/static/img/game/font_large_0.png', '/static/img/game/font_large.fnt');
		// json data
		this.load.json('chart_data', `/static/live/${config.liveId}/level.json`);
		// get dpi
		let dpix = document.getElementById('dpi').offsetWidth;
		let dpiy = document.getElementById('dpi').offsetHeight;
		let canvasx = document.getElementById('game-main').offsetWidth;
		let canvasy = document.getElementById('game-main').offsetHeight;
		let dx = dpix / canvasx * config.width;
		let dy = dpiy / canvasy * config.height;
		config.flickDistance = Math.sqrt(dx * dx + dy * dy) * 0.25;
		// scenes
		this.scene.add('s_game', gameScene);
		this.scene.add('s_cover', coverScene);
		this.scene.add('s_score', scoreScene);
	},
	create: function () {
		let sheetSet = [
			['a_hold', 60, -1],
			['a_normal', 60, 0],
			['a_flick', 60, 0]
		];
		for (let desc of sheetSet) {
			this.anims.create({
				key: desc[0] + '_play',
				frames: this.anims.generateFrameNumbers(desc[0]),
				frameRate: desc[1],
				repeat: desc[2]
			});
		}
	},
	update: function () {
		if (audioLoaded == audioCount) {
			this.scene.start('s_cover');
		}
	}
};