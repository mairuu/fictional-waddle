import type { Observer, ObserverInit, Subscriber, Teardown } from '~/lib/types/store';

import { is_function } from '~/lib/utils/is_function';
import { SubscribtionImpl } from '~/lib/store/impl/subscribtion_impl';

export function run_teardown(teardown: Teardown | null | undefined | void) {
	if (!teardown) return;

	if (is_function(teardown)) teardown();
	else teardown.unsubscribe();
}

export function create_subscriber<T>(init: ObserverInit<T>) {
	const observer = init instanceof SubscriberImpl ? init : new ConsumerObserver(init);
	return new SubscriberImpl<T>(observer);
}

export class SubscriberImpl<T> extends SubscribtionImpl implements Subscriber<T> {
	protected is_stopped = false;

	constructor(protected dest: Observer<any>) {
		super();

		if (dest instanceof SubscribtionImpl) {
			dest.add(this);
		}
	}

	protected intl_complete() {
		try {
			this.dest.complete();
		} finally {
			this.unsubscribe();
		}
	}

	protected intl_on_error(error: unknown) {
		try {
			this.dest.on_error(error);
		} finally {
			this.unsubscribe();
		}
	}

	protected intl_on_value(value: T) {
		this.dest.on_value(value);
	}

	unsubscribe(): void {
		if (this.is_stopped) return;

		super.unsubscribe();

		this.dest = null as any;
		this.is_stopped = true;
	}

	complete(): void {
		if (this.is_stopped) return;

		this.intl_complete();
	}

	on_error(error: unknown): void {
		if (this.is_stopped) return;

		this.intl_on_error(error);
	}

	on_value(value: T): void {
		if (this.is_stopped) return;

		this.intl_on_value(value);
	}
}

class ConsumerObserver<T> implements Observer<T> {
	private partial: Partial<Observer<T>>;

	constructor(init: ObserverInit<T>) {
		this.partial = is_function(init) ? { on_value: init } : init;
	}

	complete() {
		if (this.partial.complete) {
			this.partial.complete();
		}
	}

	on_error(error: unknown) {
		if (this.partial.on_error) {
			this.partial.on_error(error);
		} else {
			throw error;
		}
	}

	on_value(value: T) {
		if (this.partial.on_value) {
			this.partial.on_value(value);
		}
	}
}
