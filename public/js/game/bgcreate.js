import game from './index.js';
import config from './config.js';

export default function () {
	// background image
	game.bg1 = this.add.sprite(0, 0, 'bg_normal');
	game.bg1.setDisplaySize(config.width, config.height);
	game.bg1.setDepth(-10);
	game.bg1.setOrigin(0, 0);
	// lane image
	game.bglane = this.add.sprite(config.centerX, 50, 'bg_lanes');
	game.bglane.setDisplaySize(config.width - 200, config.height - 150);
	game.bglane.setDepth(-5);
	game.bglane.setOrigin(0.5, 0);
	// game play line
	game.gameline = this.add.sprite(config.centerX, config.height - 100, 'game_line');
	game.gameline.setDisplaySize(config.width + 350, 34);
	game.gameline.setDepth(0);
};