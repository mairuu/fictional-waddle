import type { UnaryFunction, OperatorFunction } from '~/lib/types/store';

import { operate } from '.';
import { create_operator_subscriber } from '~/lib/store/operators/operator_subscriber';

export const map = <T, R>(fn: UnaryFunction<T, R>): OperatorFunction<T, R> =>
	operate<T, R>((src, dest) => {
		const subscriber = create_operator_subscriber<T>(dest, {
			on_value: (value) => dest.on_value(fn(value)),
		});

		return src.subscribe(subscriber);
	});
