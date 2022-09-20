export type Subscriber<T> = (value: T) => void;
export type Unsubscriber = () => void;
export type Updater<T> = (value: T) => T;
export type Invalidator<T> = (value?: T) => void;
export type StartStopNotifier<T> = (set: Subscriber<T>) => Unsubscriber | void;

export type UnaryFunction<T, R> = (source: T) => R;
export type OperatorFunction<T, R> = UnaryFunction<Readable<T>, Readable<R>>;

export type ReadableInput<T> = Readable<T> | PromiseLike<T>;
export type ReadableInputOf<O> = O extends ReadableInput<infer R> ? R : never;

export interface Readable<T> {
	subscribe(this: void, run: Subscriber<T>, invalidate?: Invalidator<T>): Unsubscriber;

	pipe(): Readable<T>;
	pipe<A>(op1: OperatorFunction<T, A>): Readable<A>;
	pipe<A, B>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>): Readable<B>;
	pipe<A, B, C>(
		op1: OperatorFunction<T, A>,
		op2: OperatorFunction<A, B>,
		op3: OperatorFunction<B, C>
	): Readable<C>;
	pipe<A, B, C, D>(
		op1: OperatorFunction<T, A>,
		op2: OperatorFunction<A, B>,
		op3: OperatorFunction<B, C>,
		op4: OperatorFunction<C, D>
	): Readable<D>;
	pipe<A, B, C, D, E>(
		op1: OperatorFunction<T, A>,
		op2: OperatorFunction<A, B>,
		op3: OperatorFunction<B, C>,
		op4: OperatorFunction<C, D>,
		op5: OperatorFunction<D, E>
	): Readable<E>;
	pipe<A, B, C, D, E>(
		op1: OperatorFunction<T, A>,
		op2: OperatorFunction<A, B>,
		op3: OperatorFunction<B, C>,
		op4: OperatorFunction<C, D>,
		op5: OperatorFunction<D, E>,
		...ops: OperatorFunction<D, any>[]
	): Readable<any>;
}

export interface Writable<T> extends Readable<T> {
	set(this: void, value: T): void;
	update(this: void, updater: Updater<T>): void;
}
