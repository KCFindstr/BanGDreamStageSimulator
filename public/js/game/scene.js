import config from './config.js';
import bgcreate from './bgcreate.js';
import game from './index.js';
import TrackManager from './track.js';
import chartLoader from './chartloader.js';
import TouchManager from './touch.js';
import ScoreManager from './score.js';

export default {
	preload: function() {
		game.scene = this;
		// Init Chart
		game.chart = this.cache.json.get('chart_data');
		chartLoader(game.chart);
		game.chart.range = config.MAXRANGE / config.speed;
		// tap sound
		game.tapse = game.sound['se_tap'].play();
		game.sound['se_tap'].stop(game.tapse);
		// Track Manager
		game.trackManager = new TrackManager(this);
		// Touch Manager
		game.touchManager = new TouchManager(this);
		// Score Manager
		game.scoreManager = new ScoreManager(this);
	},
	create: function() {
		bgcreate.apply(this);
		game.bgm = game.sound['bgm'];
	},
	update: function() {
		if (game.trackManager.finish) {
			let time = game.scene.time.now - game.trackManager.finish;
			if (time >= 3000) {
				game.bgm.stop();
				game.sound['se_tap'].stop();
				game.scene.scene.start('s_score');
				return;
			}
		}
		game.trackManager.updateVisibleNotes();
		game.scoreManager.update();
	}
};