import type { Observer, Subscriber } from '~/lib/types/store';

import { SubscriberImpl } from '~/lib/store/impl/subscriber_impl';

export function create_operator_subscriber<T>(
	destination: Observer<any>,
	handlers: Partial<Observer<T>>
): Subscriber<T> {
	return new OperatorSubscriber(destination, handlers);
}

export class OperatorSubscriber<T> extends SubscriberImpl<T> {
	constructor(dest: Observer<any>, { complete, on_error, on_value }: Partial<Observer<T>>) {
		super(dest);

		this.intl_complete = complete
			? () => {
					try {
						complete();
					} catch (err) {
						dest.on_error(err);
					} finally {
						this.unsubscribe();
					}
			  }
			: super.intl_complete;

		this.intl_on_error = on_error
			? (err) => {
					try {
						on_error(err);
					} catch (error) {
						dest.on_error(err);
					} finally {
						this.unsubscribe();
					}
			  }
			: super.intl_on_error;

		this.intl_on_value = on_value
			? (value) => {
					try {
						on_value(value);
					} catch (err) {
						dest.on_error(err);
					}
			  }
			: super.intl_on_value;
	}
}
