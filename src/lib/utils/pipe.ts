import type { UnaryFunction } from '~/lib/types/store';

import { identity } from '~/lib/utils/identity';

export function pipe<T, R>(fns: UnaryFunction<any, any>[]): UnaryFunction<any, any> {
	if (fns.length === 0) return identity;
	if (fns.length === 1) return fns[0];

	return function piped(input: T) {
		return fns.reduce((prev: any, fn: UnaryFunction<T, R>) => fn(prev), input as any);
	};
}
