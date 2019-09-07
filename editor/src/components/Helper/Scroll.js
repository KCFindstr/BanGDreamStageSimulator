let html = document.scrollingElement;
export default function(position) {
	if (position == undefined) {
		position = html.scrollHeight - $(window).outerHeight();
	}
	html.scrollTop = position;
}