import { readable } from '.';
import { from } from './readables';
import { UNINITIALIZED_VALUE } from './store_impl';

import type {
	OperatorFunction,
	Readable,
	ReadableInput,
	ReadableInputOf,
	Subscriber,
	UnaryFunction,
	Unsubscriber,
} from '~/lib/types/store';

const operate = <T, R>(
	operate: (source: Readable<T>, destination: Subscriber<R>) => Unsubscriber,
	value?: R
): OperatorFunction<T, R> => {
	return (source) => readable<R>(value, (dest) => operate(source, dest));
};

export const map = <T, R>(fn: UnaryFunction<T, R>): OperatorFunction<T, R> =>
	operate((src, dest) => {
		return src.subscribe((new_value) => dest(fn(new_value)));
	});

export const filter: {
	<T, S extends T>(predicate: (value: T) => value is S): OperatorFunction<T, S>;
	<T>(predicate: (value: T) => unknown): OperatorFunction<T, T>;
} = <T>(predicate: (value: T) => unknown): OperatorFunction<T, T> =>
	operate((src, dest) => {
		return src.subscribe((new_value) => {
			if (predicate(new_value)) dest(new_value);
			else dest(UNINITIALIZED_VALUE as T);
		});
	});

export const tap = <T>(fn: (value: T) => void): OperatorFunction<T, T> =>
	operate((src, dest) => {
		return src.subscribe((new_value) => {
			fn(new_value);
			dest(new_value);
		});
	});

export const switch_map = <T, O extends ReadableInput<any>>(
	fn: (value: T) => O
): OperatorFunction<T, ReadableInputOf<O>> =>
	operate((src, dest) => {
		let inner_unsub: Unsubscriber | undefined;
		const outer_unsub = src.subscribe((new_value) => {
			inner_unsub?.();
			inner_unsub = from(fn(new_value)).subscribe(dest);
		});

		return () => {
			outer_unsub();
			inner_unsub?.();
		};
	});
