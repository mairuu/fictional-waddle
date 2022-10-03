import type { ObserverInput, OperatorFunction } from '~/lib/types/store';

import { operate } from '.';
import { from } from '~/lib/store/observables';
import { create_operator_subscriber } from '~/lib/store/operators/operator_subscriber';

export const start_with = <T, R>(producer: () => ObserverInput<R>): OperatorFunction<T, T | R> =>
	operate((src, dest) => {
		return from(producer()).subscribe(
			create_operator_subscriber(dest, {
				complete: () => src.subscribe(dest),
			})
		);
	});
