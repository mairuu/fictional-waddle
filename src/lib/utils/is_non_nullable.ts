export function is_non_nullable<T>(value: T): value is NonNullable<T> {
	return Boolean(value);
}
