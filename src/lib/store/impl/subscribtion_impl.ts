import type { Subscribtion, Teardown } from '~/lib/types/store';

import { run_teardown } from '~/lib/store/impl/subscriber_impl';

export class SubscribtionImpl implements Subscribtion {
	private _teardowns = new Set<Teardown>();

	is_closed = false;

	unsubscribe(): void {
		if (this.is_closed) return;

		const errors: unknown[] = [];

		for (const teardown of this._teardowns)
			try {
				run_teardown(teardown);
			} catch (err) {
				errors.push(err);
			}

		this.is_closed = true;
		this._teardowns.clear();

		if (errors.length) throw errors;
	}

	add(teardown: Teardown) {
		if (teardown === this) return;

		if (this.is_closed) {
			return run_teardown(teardown);
		}

		this._teardowns.add(teardown);
	}

	remove(teardown: Teardown): void {
		this._teardowns.delete(teardown);
	}
}
