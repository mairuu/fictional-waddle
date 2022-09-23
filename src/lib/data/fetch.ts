import {
	is_resource_error,
	is_resource_fulfilled,
	resource_error,
	resource_fulfilled,
	resource_pending,
} from '~/lib/utils/resource';
import { filter, first_of, map, tap, writable } from '~/lib/store';

import type { Resource } from '~/lib/utils/resource';
import type { Readable } from '~/lib/types/store';

interface CacheEntry<T> {
	store: Readable<Resource<T>>;
	timeout: ReturnType<typeof setTimeout> | null;
	stale_at: number;
}

export interface QueryOption<T> {
	fetcher?: (info: RequestInfo, init?: RequestInit) => Promise<Response>;
	initail?: T;
	keep_time?: number;
	revalidate_time?: number;
	revalidate_if_stale?: boolean;
}

const entries = new Map<string, CacheEntry<unknown>>();

const is_stale = (cache: CacheEntry<unknown>) => cache.stale_at < Date.now();

export const query = <T>(url: string, options: QueryOption<T> = {}): Readable<Resource<T>> => {
	const {
		fetcher = fetch,
		initail = null,
		keep_time = 1000 * 60 * 5,
		revalidate_time = 1000 * 60 * 1,
		revalidate_if_stale = true,
	} = options;

	let entry = entries.get(url) as CacheEntry<T> | undefined;
	if (entry) return entry.store;

	const { pipe, set, subscribe, update } = writable<Resource<T>>(resource_pending(initail), start);

	entry = { store: { subscribe, pipe }, stale_at: -1, timeout: null };
	entries.set(url, entry);

	async function revalidate() {
		if (!entry) return;

		update((e) => resource_pending(e.data));

		try {
			const res = await fetcher(url);
			const data = await res.json();

			set(resource_fulfilled(data));

			entry.stale_at = Date.now() + revalidate_time;
		} catch (err) {
			update((e) => resource_error(err, e.data));
		}
	}

	function start() {
		if (!entry) return;

		if (entry.timeout) {
			clearTimeout(entry.timeout);
			entry.timeout = null;
		}

		if (revalidate_if_stale && is_stale(entry)) revalidate();

		return () => {
			if (entry && !entry.timeout) {
				entry.timeout = setTimeout(() => entries.delete(url), keep_time);
			}
		};
	}

	return entry.store;
};

export const first_fulfilled = <T>(readable: Readable<Resource<T>>) =>
	first_of(
		readable.pipe(
			tap((res) => {
				if (is_resource_error(res)) throw res.err;
			}),
			filter(is_resource_fulfilled),
			map((res) => res.data)
		)
	);
