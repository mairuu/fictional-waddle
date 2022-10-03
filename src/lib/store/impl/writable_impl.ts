import type { StartNotifier, Writable } from '~/lib/types/store';

import { noop } from '~/lib/utils/noop';
import { ReadableImpl } from '~/lib/store/impl/readable_impl';

export function create_writable<T>(value: T, start: StartNotifier<T> = noop): Writable<T> {
	return new WritableImpl<T>(value, start);
}

export class WritableImpl<T> extends ReadableImpl<T> implements Writable<T> {
	set(value: T) {
		this.on_value(value);
	}

	update(updator: (value: T) => T) {
		this.set(updator(this.value));
	}
}
