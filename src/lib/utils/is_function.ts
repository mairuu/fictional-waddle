export function is_function(value: any): value is (...args: any[]) => any {
	return typeof value === 'function';
}
