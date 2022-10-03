import type { OperatorFunction } from '~/lib/types/store';

import { operate } from '.';
import { create_operator_subscriber } from '~/lib/store/operators/operator_subscriber';

export const filter: {
	<T, S extends T>(predicate: (value: T) => value is S): OperatorFunction<T, S>;
	<T>(predicate: (value: T) => unknown): OperatorFunction<T, T>;
} = <T>(predicate: (value: T) => unknown): OperatorFunction<T, T> =>
	operate((src, dest) => {
		const subscriber = create_operator_subscriber<T>(dest, {
			on_value: (value) => predicate(value) && dest.on_value(value),
		});

		return src.subscribe(subscriber);
	});
