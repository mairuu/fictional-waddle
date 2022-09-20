import type { Readable } from '~/lib/types/store';

export const is_function = (value: any): value is (...args: any[]) => any =>
	typeof value === 'function';

export const is_promise = <T>(value: any): value is PromiseLike<T> => is_function(value?.then);

export const is_readable = <T>(value: any): value is Readable<T> => is_function(value?.subscribe);

export const is_non_nullable = <T>(value: T): value is NonNullable<T> => Boolean(value);
