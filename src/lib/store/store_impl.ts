import { noop } from 'svelte/internal';

import type {
	UnaryFunction,
	Invalidator,
	OperatorFunction,
	StartStopNotifier,
	Writable,
	Unsubscriber,
	Subscriber,
	Updater,
	Readable,
} from '~/lib/types/store';

export const UNINITIALIZED_VALUE = Symbol.for('UNINITIALIZED_VALUE');

const identity = <T>(value: T) => value;

const create_pipe = <T, R>(fns: UnaryFunction<any, any>[]): UnaryFunction<any, any> => {
	if (fns.length === 0) return identity;
	if (fns.length === 1) return fns[0];
	return function piped(input: T) {
		return fns.reduce((prev: any, fn: UnaryFunction<T, R>) => fn(prev), input as any);
	};
};

class ReadableImpl<T> implements Readable<T> {
	private static subscriber_queue: any[] = [];

	private stop: Unsubscriber | null = null;
	private subscribers = new Set<readonly [Subscriber<T>, Invalidator<T>]>();

	constructor(
		protected value: T = UNINITIALIZED_VALUE as T,
		private start: StartStopNotifier<T> = noop
	) {
		this._set = this._set.bind(this);
	}

	protected _set(new_value: T) {
		if (this.value === new_value) return;
		this.value = new_value;

		if (!this.stop) return;
		const subscriber_queue = ReadableImpl.subscriber_queue;
		const run_queue = !subscriber_queue.length;

		if (this.value !== UNINITIALIZED_VALUE)
			for (const subscriber of this.subscribers) {
				subscriber[1]();
				subscriber_queue.push(subscriber, this.value);
			}

		if (run_queue) {
			for (let i = 0; i < subscriber_queue.length; i += 2)
				subscriber_queue[i][0](subscriber_queue[i + 1]);

			subscriber_queue.length = 0;
		}
	}

	subscribe(run: Subscriber<T>, invalidate: Invalidator<T> = noop) {
		const subscriber = [run, invalidate] as const;
		this.subscribers.add(subscriber);

		if (this.subscribers.size === 1) {
			this.stop = this.start(this._set) || noop;
		}

		if (this.value !== UNINITIALIZED_VALUE) {
			run(this.value);
		}

		function unsubscribe(this: ReadableImpl<T>) {
			this.subscribers.delete(subscriber);

			if (this.subscribers.size === 0) {
				this.stop?.();
				this.stop = null;
			}
		}

		return unsubscribe.bind(this);
	}

	pipe(...fns: OperatorFunction<any, any>[]) {
		return create_pipe(fns)(this);
	}
}

class WritableImpl<T> extends ReadableImpl<T> implements Writable<T> {
	set(value: T) {
		this._set(value);
	}

	update(updater: Updater<T>) {
		this._set(updater(this.value));
	}
}

export const readable_impl = <T>(
	value: T = UNINITIALIZED_VALUE as T,
	start: StartStopNotifier<T> = noop
): Readable<T> => new ReadableImpl(value, start);

export const writable_impl = <T>(
	value: T = UNINITIALIZED_VALUE as T,
	start: StartStopNotifier<T> = noop
): Writable<T> => new WritableImpl(value, start);
