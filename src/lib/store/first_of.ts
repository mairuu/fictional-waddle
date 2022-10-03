import { create_subscriber } from '~/lib/store/impl/subscriber_impl';

import type { Observable } from '~/lib/types/store';

export const first_of = <T>(src: Observable<T>) =>
	new Promise<T>((resolve, reject) => {
		const subscriber = create_subscriber<T>({
			complete: reject,
			on_error: reject,
			on_value: (value) => {
				resolve(value);
				subscriber.unsubscribe();
			},
		});

		src.subscribe(subscriber);
	});
