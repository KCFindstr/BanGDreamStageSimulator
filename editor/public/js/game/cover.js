import bgcreate from './bgcreate.js';
import config from './config.js';
import newButton from './button.js';

export default {
	preload: function () {
	},
	create: function() {
		bgcreate.apply(this);
		newButton(this, config.centerX, config.centerY - 120, 400, 100, 'Play', () => {
			this.scene.start('s_game');
		});
		newButton(this, config.centerX, config.centerY, 400, 100, 'Fullscreen', () => {
			this.scale.startFullscreen();
		});
		newButton(this, config.centerX, config.centerY + 120, 400, 100, 'Auto', () => {
			config.auto = true;
			this.scene.start('s_game');
		});
	},
}