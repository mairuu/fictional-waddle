import type { SubscriberImpl } from '~/lib/store/impl/subscriber_impl';
import type {
	StartNotifier,
	Observable,
	ObserverInit,
	Subscribtion,
	OperatorFunction,
} from '~/lib/types/store';

import { create_subscriber } from '~/lib/store/impl/subscriber_impl';
import { pipe } from '~/lib/utils/pipe';

export function create_observable<T>(start: StartNotifier<T>): Observable<T> {
	return new ObservableImpl<T>(start);
}

export function is_observable<T>(value: any): value is Observable<T> {
	return value instanceof ObservableImpl;
}

export class ObservableImpl<T> implements Observable<T> {
	constructor(protected start: StartNotifier<T>) {}

	protected intl_subscribe(subscriber: SubscriberImpl<T>) {
		try {
			const teardown = this.start(subscriber);
			if (teardown) subscriber.add(teardown);
		} catch (err) {
			subscriber.on_error(err);
		}
	}

	subscribe(init: ObserverInit<T>): Subscribtion {
		const subscriber = create_subscriber(init);

		this.intl_subscribe(subscriber);

		return subscriber;
	}

	pipe(...fns: OperatorFunction<any, any>[]) {
		return pipe(fns)(this);
	}
}
