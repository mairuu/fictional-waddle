import type { Resource } from '~/lib/utils/resource';
import type { Observable } from '~/lib/types/store';

import { browser } from '$app/env';
import {
	is_resource_error,
	is_resource_fulfilled,
	resource_error,
	resource_fulfilled,
	resource_pending,
} from '~/lib/utils/resource';
import { filter, first_of, map, create_writable } from '~/lib/store';

interface CacheEntry<T> {
	store: Observable<Resource<T>>;
	timeout: ReturnType<typeof setTimeout> | null;
	stale_at: number;
}

export type Fetcher = (info: RequestInfo, init?: RequestInit) => Promise<Response>;

export interface QueryOption<T> {
	fetcher?: Fetcher;
	initail?: T;
	keep_time?: number;
	revalidate_time?: number;
	revalidate_if_stale?: boolean;
}

const entries = new Map<string, CacheEntry<unknown>>();

const is_stale = (cache: CacheEntry<unknown>) => cache.stale_at < Date.now();

const DEFAULT_KEEP_TIME = browser
	? 1000 * 60 * 5 //  5 minutes on client
	: 1000 * 60 * 1; // 1 munute  on server;

const DEFAULT_REVALIDATE_TIME = 1000 * 60 * 1;

export const query = <T>(url: string, options: QueryOption<T> = {}): Observable<Resource<T>> => {
	const {
		fetcher = fetch,
		initail = null,
		keep_time = DEFAULT_KEEP_TIME,
		revalidate_time = DEFAULT_REVALIDATE_TIME,
		revalidate_if_stale = true,
	} = options;

	if (entries.has(url)) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return entries.get(url)!.store;
	}

	const store = create_writable<Resource<T>>(resource_pending(initail), start);

	const entry: CacheEntry<T> = { store, stale_at: -1, timeout: null };
	entries.set(url, entry);

	async function revalidate() {
		if (!entry) return;

		store.update((e) => resource_pending(e.data));

		try {
			const res = await fetcher(url);
			const data = await res.json();

			store.set(resource_fulfilled(data));

			entry.stale_at = Date.now() + revalidate_time;
		} catch (err) {
			store.update((e) => resource_error(err, e.data));
		}
	}

	function start() {
		if (entry.timeout) {
			clearTimeout(entry.timeout);
			entry.timeout = null;
		}

		if (revalidate_if_stale && is_stale(entry)) revalidate();

		return () => {
			if (!entry.timeout) {
				entry.timeout = setTimeout(() => {
					entries.delete(url);
				}, keep_time);
			}
		};
	}

	return entry.store;
};

export const first_fulfilled = async <T>(src: Observable<Resource<T>>): Promise<T> =>
	first_of(
		src.pipe(
			filter(((res) => {
				if (is_resource_error(res)) throw res.err;
				return is_resource_fulfilled(res);
			}) as typeof is_resource_fulfilled),
			map((res) => res.data)
		)
	);
