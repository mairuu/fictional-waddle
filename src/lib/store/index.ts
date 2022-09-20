import { writable_impl } from './store_impl';

import type { Readable, StartStopNotifier } from '~/lib/types/store';

export * from './operators';
export * from './readables';

export const writable = writable_impl;

export const readable = <T>(value?: T, start?: StartStopNotifier<T>): Readable<T> => {
	const writable = writable_impl(value, start);
	return { pipe: writable.pipe, subscribe: writable.subscribe };
};

export const first_of = <T>(store: Readable<T>) =>
	new Promise<T>((resolve) => {
		const unsub = store.subscribe((new_value) => {
			resolve(new_value);
			setTimeout(() => unsub());
		});
	});
