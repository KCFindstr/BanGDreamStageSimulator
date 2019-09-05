let style = {
	fontSize: '32px',
	fill: '#fff',
	align: 'center',
};

export default function newButton(scene, x, y, w, h, text, onclick) {
	let rect = scene.add.rectangle(x, y, w, h, 0xffffff, .5);
	rect.setInteractive().on('pointerdown', onclick);
	let txt = scene.add.text(x, y, text, style);
	txt.setOrigin(0.5, 0.5);
	return rect;
};