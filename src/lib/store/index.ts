import { readable_impl, writable_impl } from './store_impl';

import type { Readable, Unsubscriber } from '~/lib/types/store';

export * from './operators';
export * from './readables';

export const writable = writable_impl;

export const readable = readable_impl;

export const first_of = <T>(store: Readable<T>) =>
	new Promise<T>((resolve) => {
		let unsub: Unsubscriber | null = null;
		let is_resolved = false;

		unsub = store.subscribe((new_value) => {
			resolve(new_value);
			is_resolved = true;
			unsub?.();
		});

		if (is_resolved) unsub();
	});
