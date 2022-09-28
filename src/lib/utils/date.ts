export type DateInput = string | Date | number;

export function to_date(input: DateInput) {
	if (input instanceof Date) return input;

	return new Date(input);
}

export function format_distance(date: DateInput) {
	const mil = Date.now() - to_date(date).getTime();
	const sec = Math.trunc(mil / 1000);
	const min = Math.round(sec / 60);

	switch (true) {
		case min === 0:
			return 'เมื่อสักครู่';

		case min < 60:
			return `${min} นาที`;

		case min < 60 * 24:
			return `${Math.round(min / 60)} ชม.`;

		case min < 60 * 24 * 365:
			return `${Math.round(min / 60 / 24)} วัน`;

		default:
			return `${Math.round(min / 60 / 24 / 365)} ปี`;
	}
}

export function is_today(date: DateInput) {
	return is_same_day(date, new Date());
}

export function is_same_day(left: DateInput, right: DateInput) {
	left = to_date(left);
	left.setHours(0, 0, 0, 0);
	right = to_date(right);
	right.setHours(0, 0, 0, 0);

	return left.getTime() === right.getTime();
}
