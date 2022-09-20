export type Resource<T> = ResourceFulfilled<T> | ResourcePending<T> | ResourceError<T>;

export interface ResourceFulfilled<T> {
	err: null;
	data: T;
	is_error: false;
	is_loading: false;
}

export interface ResourcePending<T> {
	err: null;
	data: T | null;
	is_error: false;
	is_loading: true;
}

export interface ResourceError<T> {
	err: unknown;
	data: T | null;
	is_error: true;
	is_loading: false;
}

export const is_resource_fulfilled = <T>(res: Resource<T>): res is ResourceFulfilled<T> =>
	!res.is_loading && !res.is_error;

export const is_resource_pending = <T>(res: Resource<T>): res is ResourcePending<T> =>
	res.is_loading && !res.is_error;

export const is_resource_error = <T>(res: Resource<T>): res is ResourceError<T> =>
	!res.is_loading && res.is_error;
