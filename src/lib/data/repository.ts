import type { FavoriteEntity, HistoryEntity, GetAllOptions, Updater } from '~/lib/data/database';
import type { Fetcher } from '~/lib/data/fetch';
import type { CommentSorting, CommentTree } from '~/lib/types/comment';
import type { Chapter, LatestChapter, Project, ProjectType } from '~/lib/types/nekopost';

import { query } from '~/lib/data/fetch';
import { NekoDao } from '~/lib/data/database';

export class Repository {
	private dao = new NekoDao();

	fetcher: Fetcher | undefined = fetch;

	private fetch<T>(url: string) {
		return query<T>(url, { fetcher: this.fetcher });
	}

	get_project(project_id: number) {
		const url = `/api/p/${project_id}`;
		return this.fetch<Project>(url);
	}

	get_chapter(project_id: number, chapter_id: number) {
		const url = `/api/p/${project_id}/${chapter_id}`;
		return this.fetch<Chapter>(url);
	}

	get_comment(path: string, { sort }: { sort: CommentSorting }) {
		const search = new URLSearchParams();
		search.set('path', path);
		search.set('sort', sort);
		const url = `/api/comments?${search.toString()}`;

		return this.fetch<CommentTree>(url);
	}

	get_latest_chapters(type: ProjectType, index: number) {
		const url = `/api/latest/${type[0]}/${index}`;
		return this.fetch<LatestChapter[]>(url);
	}

	//

	get_favorite(id: number) {
		return this.dao.get('favorites', id);
	}

	get_favorites(options?: GetAllOptions) {
		return this.dao.get_all('favorites', { ...options, index_name: 'by_date_added' });
	}

	put_favorite(id: number, value: Updater<FavoriteEntity>) {
		return this.dao.put('favorites', id, value);
	}

	del_favorite(id: number) {
		return this.dao.del('favorites', id);
	}

	//

	get_history(id: number) {
		return this.dao.get('histories', id);
	}

	get_histories(options?: GetAllOptions) {
		return this.dao.get_all('histories', { ...options, index_name: 'by_read_at' });
	}

	put_history(id: number, value: Updater<HistoryEntity>) {
		return this.dao.put('histories', id, value);
	}

	del_history(id: number) {
		return this.dao.del('histories', id);
	}
}

export const repository = new Repository();
