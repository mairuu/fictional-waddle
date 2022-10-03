import type { IDBPCursorWithValue, IndexKey, IndexNames, StoreKey, StoreValue } from 'idb';
import type { NekoDB, NekoDBSchema, NekoStoreName } from '~/lib/data/database';
import type { Observable } from '~/lib/types/store';
import type { Resource } from '~/lib/utils/resource';

import { open_database } from '~/lib/data/database';
import { filter, switch_map, create_writable, start_with } from '~/lib/store';
import { is_function } from '~/lib/utils/is_function';
import { resource_error, resource_fulfilled, resource_pending } from '~/lib/utils/resource';

export interface GetAllOptions {
	skip?: number;
	take?: number;
	direction?: 'prev' | 'next';
}

interface MutateResult<T> {
	value: T;
	mut: Mutated;
}

interface QueryResult<T> {
	value: T;
	dep: Mutated;
}

type Mutated = Partial<Record<NekoStoreName, any[] | 'all'>>;

interface _GetAllOptions<StoreName extends NekoStoreName> extends GetAllOptions {
	key_range?:
		| IndexKey<NekoDBSchema, StoreName, IndexNames<NekoDBSchema, StoreName>>
		| IDBKeyRange
		| null;
	index_name: IndexNames<NekoDBSchema, StoreName>;
}

export type Updater<T> = ((value?: T | undefined) => T) | T;

export class NekoDao {
	private _mut$ = create_writable<Mutated | null>(null);
	private _neko_db = open_database();
	private _channel = create_broadcast_channel();

	constructor() {
		if (this._channel)
			this._channel.onmessage = (ev) => {
				this._mut$.set(ev.data);
			};
	}

	private query<T>(handler: (db: NekoDB) => Promise<QueryResult<T>>): Observable<Resource<T>> {
		let deps: Mutated | null = null;
		let previous_value: T | null = null;

		const should_rerun = (mut: Mutated | null) => {
			if (!deps || !mut) return true;

			const mut_names = Object.keys(mut) as NekoStoreName[];
			const dep_names = Object.keys(deps) as NekoStoreName[];

			const name = mut_names.find((name) => dep_names.includes(name));
			if (!name) return false;

			const dep_ids = deps[name];
			const mut_ids = new Set(mut[name]);

			if (dep_ids === 'all') return true;

			return dep_ids?.some((id) => mut_ids.has(id));
		};

		const run = async () => {
			const db = await this._neko_db;
			if (!db) return resource_error(new Error('Database is not available'));

			const { dep, value } = await handler(db);
			deps = dep;
			previous_value = value;

			return resource_fulfilled(value);
		};

		return this._mut$.pipe(
			filter(should_rerun),
			switch_map(run),
			start_with(() => [resource_pending(previous_value)])
		);
	}

	private async mutate<T>(handler: (db: NekoDB) => Promise<MutateResult<T>>) {
		const db = await this._neko_db;

		if (!db) {
			throw new Error('Database is not available');
		}

		const result = await handler(db);
		this.notify(result);
	}

	private notify<T>(result: MutateResult<T>) {
		if (!result?.mut) return;

		this._mut$.set(result.mut);
		this._channel?.postMessage(result.mut);
	}

	get<StoreName extends NekoStoreName>(
		store_name: StoreName,
		query: StoreKey<NekoDBSchema, StoreName>
	): Observable<Resource<StoreValue<NekoDBSchema, StoreName>>> {
		const get_handler = async (db: NekoDB) => {
			const value = await db.get(store_name, query);
			return query_result({ value, dep: { [store_name]: [query] } });
		};

		return this.query(get_handler);
	}

	put<StoreName extends NekoStoreName>(
		store_name: StoreName,
		primay_key: StoreKey<NekoDBSchema, StoreName>,
		value: Updater<StoreValue<NekoDBSchema, StoreName>>
	): Promise<void> {
		const put_handler = async (db: NekoDB) => {
			if (is_function(value)) value = value(await db.get(store_name, primay_key));
			const id = await db.put(store_name, value);

			return mutation_result({ value: id, mut: { [store_name]: [id] } });
		};

		return this.mutate(put_handler);
	}

	del<StoreName extends NekoStoreName>(
		store_name: StoreName,
		query: StoreKey<NekoDBSchema, StoreName>
	): Promise<void> {
		const del_handler = async (db: NekoDB) => {
			const value = await db.delete(store_name, query);
			return mutation_result({ value, mut: { [store_name]: [query] } });
		};

		return this.mutate(del_handler);
	}

	get_all<StoreName extends NekoStoreName>(
		store_name: StoreName,
		store_args: _GetAllOptions<StoreName>
	): Observable<Resource<StoreValue<NekoDBSchema, StoreName>[]>> {
		const get_all_handler = async (db: NekoDB) => {
			const tx = db.transaction(store_name, 'readonly');
			const { index_name, key_range, direction = 'prev' } = store_args;

			const index = tx.store.index(index_name);
			const cursor = await index.openCursor(key_range, direction);
			const value = await get_all_from_cursor(cursor, store_args);

			return query_result({ value, dep: { [store_name]: 'all' } });
		};

		return this.query(get_all_handler);
	}
}

async function get_all_from_cursor<
	TxStores extends ArrayLike<NekoStoreName>,
	StoreName extends NekoStoreName,
	IndexName
>(
	cursor: IDBPCursorWithValue<NekoDBSchema, TxStores, StoreName, IndexName, 'readonly'> | null,
	{ skip = 0, take }: GetAllOptions
) {
	const items = [];

	if (cursor && skip > 0) {
		cursor = await cursor.advance(skip);
	}

	while (cursor && (!take || items.length < take)) {
		items.push(cursor.value);
		cursor = await cursor.continue();
	}

	return items;
}

function create_broadcast_channel() {
	try {
		return new BroadcastChannel('neko-dao-mutation');
	} catch (err) {
		//
	}

	return null;
}

// sane functions
function query_result<T>(result: QueryResult<T>) {
	return result;
}

function mutation_result<T>(result: MutateResult<T>) {
	return result;
}
