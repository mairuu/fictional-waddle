import type { Observable, ObserverInput, ObserverInputOf } from '~/lib/types/store';

import { create_observable, is_observable } from '~/lib/store/impl/observable_impl';
import { is_array } from '~/lib/utils/is_array';
import { is_promise } from '~/lib/utils/is_promise';

const from_promise = <T>(promise: PromiseLike<T>): Observable<T> =>
	create_observable((dest) => {
		promise.then(
			(value) => {
				dest.on_value(value);
				dest.complete();
			},
			(error) => dest.on_error(error)
		);
	});

const from_array = <T>(array: ArrayLike<T>): Observable<T> =>
	create_observable((dest) => {
		for (let i = 0; i < array.length && !dest.is_closed; i++) {
			dest.on_value(array[i]);
		}

		dest.complete();
	});

export const from = <O extends ObserverInput<any>>(input: O): Observable<ObserverInputOf<O>> => {
	if (is_observable(input)) return input;
	if (is_promise(input)) return from_promise(input);
	if (is_array(input)) return from_array(input);

	throw new TypeError(`from: cannot create observable from ${input}`);
};
