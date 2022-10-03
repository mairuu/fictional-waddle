import { is_function } from '~/lib/utils/is_function';

export function is_promise(value: any): value is PromiseLike<any> {
	return is_function(value?.then);
}
