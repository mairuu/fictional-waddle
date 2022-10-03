import type {
	ObserverInput,
	OperatorFunction,
	ObserverInputOf,
	Subscribtion,
} from '~/lib/types/store';

import { operate } from '.';
import { from } from '~/lib/store/observables';
import { create_operator_subscriber } from '~/lib/store/operators/operator_subscriber';

export const switch_map = <T, O extends ObserverInput<any>>(
	fn: (value: T) => O
): OperatorFunction<T, ObserverInputOf<O>> =>
	operate((src, dest) => {
		let inner: Subscribtion | null = null;
		let is_completed = false;

		const check_complete = () => {
			if (is_completed && !inner) dest.complete();
		};

		const outer_subscriber = create_operator_subscriber<T>(dest, {
			on_value: (new_value) => {
				const inner_subscriber = create_operator_subscriber(dest, {
					complete: () => {
						inner = null;
						check_complete();
					},
				});

				inner?.unsubscribe();
				inner = from(fn(new_value)).subscribe(inner_subscriber);
			},

			complete: () => {
				is_completed = true;
				check_complete();
			},
		});

		const outer = src.subscribe(outer_subscriber);

		return () => {
			outer.unsubscribe();
			inner?.unsubscribe();
		};
	});
