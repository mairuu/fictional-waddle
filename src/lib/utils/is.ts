import type { Readable } from '~/lib/types/store';

export { is_resource_error, is_resource_fulfilled, is_resource_pending } from './resource';

export function is_function(value: any): value is (...args: any[]) => any {
	return typeof value === 'function';
}

export function is_promise<T>(value: any): value is PromiseLike<T> {
	return is_function(value?.then);
}

export function is_readable<T>(value: any): value is Readable<T> {
	return is_function(value?.subscribe);
}

export function is_non_nullable<T>(value: T): value is NonNullable<T> {
	return Boolean(value);
}
