import type { DBSchema, IDBPDatabase, StoreNames } from 'idb';
import type { ProjectType } from '~/lib/types/nekopost';
import type { FavoriteEntity, HistoryEntity } from '~/lib/data/database/entities';

import { openDB } from 'idb';

export type NekoDB = IDBPDatabase<NekoDBSchema>;

export type NekoStoreName = StoreNames<NekoDBSchema>;

export interface NekoDBSchema extends DBSchema {
	favorites: {
		key: number;
		value: FavoriteEntity;
		indexes: {
			by_date_added: number;
			by_type: [ProjectType, number];
		};
	};

	histories: {
		value: HistoryEntity;
		key: number;
		indexes: {
			by_read_at: number;
		};
	};
}

const DB_NAME = 'NEKO_DB';
const DB_VERSION = 1;

export const open_database = async (): Promise<NekoDB | null> => {
	const upgrade = (db: NekoDB, old_version: number) => {
		switch (old_version) {
			case 0:
				{
					const store = db.createObjectStore('favorites', { keyPath: 'project_id' });
					store.createIndex('by_date_added', 'date_added');
					store.createIndex('by_type', ['project_type', 'date_added']);
				}
				{
					const store = db.createObjectStore('histories', { keyPath: 'project_id' });
					store.createIndex('by_read_at', 'read_at');
				}
		}
	};

	try {
		return await openDB(DB_NAME, DB_VERSION, { upgrade });
	} catch (err) {
		//
	}

	return null;
};
