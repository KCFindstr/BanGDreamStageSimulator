import game from './index.js';
import config from './config.js';

let updateComboSprite = function() {
	if (this.scale < 0.1) return;
	if (this.scale >= 1) return;
	this.scale = Math.min(1, this.scale + 0.1);
}

class ScoreManager {
	constructor(scene) {
		this.scene = scene;
		this.combo = 0;
		this.maxcombo = 0;
		this.combotext = scene.add.sprite(0, 66, 'combo');
		this.combotext.setOrigin(0.5, 0);
		this.combonum = scene.add.bitmapText(0, 0, 'f_large', '0');
		this.combonum.setOrigin(0.5, 1);
		this.combosprite = scene.add.container(config.width - 300, config.centerY - 120);
		this.combosprite.add(this.combotext);
		this.combosprite.add(this.combonum);
		this.combosprite.setScale(0);
		this.combosprite.update = updateComboSprite;
		// performance count
		this.count = [0, 0, 0, 0, 0];
	}

	judge(result) {
		// console.log('judge: ' + result);
		this.count[result]++;
		game.trackManager.playJudge(result);
		if (result > config.JUDGE.GREAT) {
			this.combo = 0;
			this.combosprite.setScale(0);
		} else {
			this.combo++;
			this.maxcombo = Math.max(this.maxcombo, this.combo);
			this.combosprite.setScale(0.5);
		}
		this.combonum.setText(this.combo.toString());
	}

	update() {
		this.combosprite.update();
	}
};

export default ScoreManager;