import type { DateInput } from '~/lib/utils/date';

import { is_same_day } from '~/lib/utils/date/is_same_day';

export function is_today(date: DateInput): boolean {
	return is_same_day(date, new Date());
}
