import type { Observable, Subscriber, OperatorFunction, Teardown } from '~/lib/types/store';

import { create_observable } from '~/lib/store/impl/observable_impl';

export const operate = <T, R>(
	operate: (source: Observable<T>, destination: Subscriber<R>) => Teardown
): OperatorFunction<T, R> => {
	return (source) => create_observable<R>((dest) => operate(source, dest));
};

export { filter } from './filter';
export { map } from './map';
export { start_with } from './start_with';
export { switch_map } from './switch_map';
