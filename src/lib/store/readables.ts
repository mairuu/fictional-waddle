import { readable } from '.';
import { is_promise, is_readable } from '~/lib/utils/is';

import type { ReadableInput, ReadableInputOf, Readable } from '~/lib/types/store';

const from_promise = <T>(promise: PromiseLike<T>): Readable<T> =>
	readable<T>(undefined, (set) => {
		// Todo: handle promise exceptions
		promise.then(set);
	});

export const from = <O extends ReadableInput<any>>(input: O): Readable<ReadableInputOf<O>> => {
	if (is_readable<any>(input)) return input;
	if (is_promise(input)) return from_promise<any>(input);

	throw new TypeError();
};
