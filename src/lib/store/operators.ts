import { readable } from '.';
import { from } from './readables';
import { UNINITIALIZED_VALUE } from './store_impl';

import type {
	OperatorFunction,
	ReadableInput,
	ReadableInputOf,
	UnaryFunction,
	Unsubscriber,
} from '~/lib/types/store';

export const map = <T, R>(fn: UnaryFunction<T, R>): OperatorFunction<T, R> => {
	return ({ subscribe }) =>
		readable<R>(undefined, (set) => {
			return subscribe((v) => set(fn(v)));
		});
};

export const filter: {
	<T, S extends T>(predicate: (value: T) => value is S): OperatorFunction<T, S>;
	<T>(predicate: (value: T) => unknown): OperatorFunction<T, T>;
} = <T>(predicate: (value: T) => unknown): OperatorFunction<T, T> => {
	return ({ subscribe }) =>
		readable<T>(undefined, (set) => {
			return subscribe((new_value) => {
				if (predicate(new_value)) set(new_value);
				else set(UNINITIALIZED_VALUE as T);
			});
		});
};

export const tap = <T>(fn: (value: T) => void): OperatorFunction<T, T> => {
	return (source) => {
		const { pipe, subscribe } = readable<T>(undefined, (set) =>
			source.subscribe((new_value) => {
				fn(new_value);
				set(new_value);
			})
		);

		return { ...source, pipe, subscribe };
	};
};

export const switch_map = <T, O extends ReadableInput<any>>(
	fn: (value: T) => O
): OperatorFunction<T, ReadableInputOf<O>> => {
	return ({ subscribe }) =>
		readable<ReadableInputOf<O>>(undefined, (set) => {
			let inner_unsub: Unsubscriber | undefined;
			const outer_unsub = subscribe((new_value) => {
				inner_unsub?.();
				inner_unsub = from(fn(new_value)).subscribe(set);
			});

			return () => {
				outer_unsub();
				inner_unsub?.();
			};
		});
};
