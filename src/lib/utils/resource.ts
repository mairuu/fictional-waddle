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

export function resource_fulfilled<T>(data: T): ResourceFulfilled<T> {
	return {
		data,
		err: null,
		is_error: false,
		is_loading: false,
	};
}

export function resource_pending<T>(data: T | null = null): ResourcePending<T> {
	return {
		data,
		err: null,
		is_error: false,
		is_loading: true,
	};
}

export function resource_error<T>(err: unknown, data: T | null = null): ResourceError<T> {
	return {
		data,
		err,
		is_error: true,
		is_loading: false,
	};
}

export function is_resource_fulfilled<T>(res: Resource<T>): res is ResourceFulfilled<T> {
	return !res.is_loading && !res.is_error;
}

export function is_resource_pending<T>(res: Resource<T>): res is ResourcePending<T> {
	return res.is_loading && !res.is_error;
}

export function is_resource_error<T>(res: Resource<T>): res is ResourceError<T> {
	return !res.is_loading && res.is_error;
}
