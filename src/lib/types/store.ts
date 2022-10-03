export type StartNotifier<T> = (subscriber: Subscriber<T>) => Teardown | void;

export type Teardown = Subscribtion | (() => void);

export type UnaryFunction<T, R> = (source: T) => R;

export type OperatorFunction<T, R> = UnaryFunction<Observable<T>, Observable<R>>;

export type ObserverInit<T> = Partial<Observer<T>> | Observer<T>['on_value'];

export type ObserverInput<T> = Observable<T> | PromiseLike<T> | ArrayLike<T>;

export type ObserverInputOf<O> = O extends ObserverInput<infer R> ? R : never;

export interface Observer<T> {
	complete(): void;
	on_error(error: unknown): void;
	on_value(value: T): void;
}

export interface Subscribtion {
	readonly is_closed: boolean;
	unsubscribe(): void;
}

export interface Subscriber<T> extends Subscribtion, Observer<T> {}

export interface Observable<T> {
	subscribe(init: ObserverInit<T>): Subscribtion;

	pipe(): Observable<T>;
	pipe<A>(op1: OperatorFunction<T, A>): Observable<A>;
	pipe<A, B>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>): Observable<B>;
	pipe<A, B, C>(
		op1: OperatorFunction<T, A>,
		op2: OperatorFunction<A, B>,
		op3: OperatorFunction<B, C>
	): Observable<C>;
	pipe<A, B, C, D>(
		op1: OperatorFunction<T, A>,
		op2: OperatorFunction<A, B>,
		op3: OperatorFunction<B, C>,
		op4: OperatorFunction<C, D>
	): Observable<D>;
	pipe<A, B, C, D, E>(
		op1: OperatorFunction<T, A>,
		op2: OperatorFunction<A, B>,
		op3: OperatorFunction<B, C>,
		op4: OperatorFunction<C, D>,
		op5: OperatorFunction<D, E>
	): Observable<E>;
	pipe<A, B, C, D, E>(
		op1: OperatorFunction<T, A>,
		op2: OperatorFunction<A, B>,
		op3: OperatorFunction<B, C>,
		op4: OperatorFunction<C, D>,
		op5: OperatorFunction<D, E>,
		...ops: OperatorFunction<D, any>[]
	): Observable<any>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Readable<T> extends Observable<T> {}

export interface Writable<T> extends Readable<T> {
	set(value: T): void;

	update(updator: (value: T) => T): void;
}
