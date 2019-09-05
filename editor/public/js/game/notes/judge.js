export default function(diff, judge) {
	diff = Math.abs(diff);
	for (let i in judge) {
		if (diff <= judge[i]) {
			return i;
		}
	}
	return -1;
};