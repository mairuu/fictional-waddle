import type { DateInput } from '~/lib/utils/date';

import { to_date } from '~/lib/utils/date/to_date';

export function is_same_day(left: DateInput, right: DateInput): boolean {
	left = to_date(left);
	left.setHours(0, 0, 0, 0);
	right = to_date(right);
	right.setHours(0, 0, 0, 0);

	return left.getTime() === right.getTime();
}
