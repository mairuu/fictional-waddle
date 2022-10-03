import type { DateInput } from '~/lib/utils/date';

export function to_date(input: DateInput): Date {
	if (input instanceof Date) return input;

	return new Date(input);
}
