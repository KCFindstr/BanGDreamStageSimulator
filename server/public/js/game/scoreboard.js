import bgcreate from './bgcreate.js';
import config from './config.js';
import game from './index.js';

export default {
	preload: function () {
		game.scene = this;
	},
	create: function() {
		bgcreate.apply(this);
		let img = this.add.sprite(config.centerX, 100, 'combo');
		img.setOrigin(1, 0.5);
		img.setDepth(10);
		img.setScale(1.5);
		let txt = this.add.bitmapText(config.centerX + 50, 95, 'f_large', game.scoreManager.maxcombo.toString());
		txt.setOrigin(0, 1);
		txt.setDepth(10);
		txt.setScale(0.6);

		let currenty = 200;
		for (let i=0; i<5; i++) {
			let img = this.add.sprite(config.centerX, currenty, 'judge_' + i);
			img.setOrigin(1, 0.5);
			img.setDepth(10);
			img.setScale(1);
			let txt = this.add.bitmapText(config.centerX + 50, currenty - 5, 'f_large', game.scoreManager.count[i].toString());
			txt.setOrigin(0, 1);
			txt.setDepth(10);
			txt.setScale(0.6);
			currenty += 80;
		}
	},
}