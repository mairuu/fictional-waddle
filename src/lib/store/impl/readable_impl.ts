import type { Observer, Readable, StartNotifier, Subscriber, Teardown } from '~/lib/types/store';
import type { SubscriberImpl } from '~/lib/store/impl/subscriber_impl';

import { noop } from '~/lib/utils/noop';
import { ObservableImpl } from '~/lib/store/impl/observable_impl';
import { run_teardown } from '~/lib/store/impl/subscriber_impl';

export function create_readable<T>(value: T, start: StartNotifier<T> = noop): Readable<T> {
	return new ReadableImpl<T>(value, start);
}

export class ReadableImpl<T> extends ObservableImpl<T> implements Readable<T>, Subscriber<T> {
	is_closed = false;

	protected stop: Teardown | null = null;

	protected subscribers = new Set<Observer<T>>();

	constructor(protected value: T, start: StartNotifier<T>) {
		super(start);
	}

	private run_stop_if_needed() {
		if (this.subscribers.size !== 0) return;

		run_teardown(this.stop);
		this.stop = null;
	}

	protected intl_subscribe(subscriber: SubscriberImpl<T>) {
		this.subscribers.add(subscriber);

		if (this.subscribers.size === 1) this.stop = this.start(this) || noop;

		if (!subscriber.is_closed) {
			subscriber.on_value(this.value);
		}

		subscriber.add(() => {
			subscriber.remove(subscriber);
			this.run_stop_if_needed();
		});
	}

	unsubscribe() {
		this.is_closed = true;
		this.subscribers.clear();
		this.run_stop_if_needed();
	}

	complete() {
		if (this.is_closed) return;

		for (const subscriber of this.subscribers) {
			subscriber.complete();
		}

		this.subscribers.clear();
		this.run_stop_if_needed();
	}

	on_error(error: unknown) {
		if (this.is_closed) return;

		for (const subscriber of this.subscribers) {
			subscriber.on_error(error);
		}

		this.subscribers.clear();
		this.run_stop_if_needed();
	}

	on_value(value: T) {
		if (this.is_closed) return;

		this.value = value;

		if (!this.stop) return;

		for (const subscriber of this.subscribers) {
			subscriber.on_value(value);
		}
	}
}
