module.exports = function (req, res, next) {
	let config = {
		flick: 0,
		long: 0,
		normal: 0,
		se: 0,
		line: 0,
		speed: 8,
		scale: 1
	};
	let userConfig = req.cookies.config;
	if (userConfig && userConfig.length) {
		try {
			userConfig = JSON.parse(userConfig);
			Object.assign(config, userConfig);
		} catch (e) {}
	}
	req.cookies.config = config;
	res.cookie('config', JSON.stringify(config));
	next();
}