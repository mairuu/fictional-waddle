import { noop, safe_not_equal } from 'svelte/internal';

import type {
	UnaryFunction,
	Invalidator,
	OperatorFunction,
	StartStopNotifier,
	Writable,
	Unsubscriber,
	Subscriber,
	Updater,
} from '~/lib/types/store';

export const UNINITIALIZED_VALUE = Symbol.for('UNINITIALIZED_VALUE');

const subscriber_queue: any[] = [];

const identity = <T>(value: T) => value;

const create_pipe = <T, R>(fns: UnaryFunction<any, any>[]): UnaryFunction<any, any> => {
	if (fns.length === 0) return identity;
	if (fns.length === 1) return fns[0];
	return function piped(input: T) {
		return fns.reduce((prev: any, fn: UnaryFunction<T, R>) => fn(prev), input as any);
	};
};

export const writable_impl = <T>(
	value: T = UNINITIALIZED_VALUE as T,
	start: StartStopNotifier<T> = noop
): Writable<T> => {
	let stop: Unsubscriber | null = null;

	const self: Writable<T> = { set, update, subscribe, pipe };
	const subscribers = new Set<readonly [Subscriber<T>, Invalidator<T>]>();

	function set(new_value: T) {
		if (!safe_not_equal(value, new_value)) return;
		value = new_value;

		if (!stop) return;
		const run_queue = !subscriber_queue.length;

		for (const subscriber of subscribers) {
			if (value === UNINITIALIZED_VALUE) continue;

			subscriber[1]();
			subscriber_queue.push(subscriber, value);
		}

		if (!run_queue) return;

		for (let i = 0; i < subscriber_queue.length; i += 2) {
			subscriber_queue[i][0](subscriber_queue[i + 1]);
		}
		subscriber_queue.length = 0;
	}
	function update(fn: Updater<T>) {
		set(fn(value));
	}
	function subscribe(run: Subscriber<T>, invalidate: Invalidator<T> = noop) {
		const subscriber = [run, invalidate] as const;
		subscribers.add(subscriber);

		if (subscribers.size === 1) stop = start(set) || noop;
		if (value !== UNINITIALIZED_VALUE) run(value);

		return () => {
			subscribers.delete(subscriber);

			if (subscribers.size === 0) {
				stop?.();
				stop = null;
			}
		};
	}
	function pipe(...fns: OperatorFunction<any, any>[]) {
		return create_pipe(fns)(self);
	}

	return self;
};
