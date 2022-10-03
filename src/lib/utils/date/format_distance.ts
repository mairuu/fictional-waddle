import type { DateInput } from '~/lib/utils/date';

import { to_date } from '~/lib/utils/date/to_date';

export function format_distance(date: DateInput): string {
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
