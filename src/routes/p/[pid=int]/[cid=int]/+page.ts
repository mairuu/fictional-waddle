import type { PageLoad } from './$types';

import { repository } from '~/lib/data/repository';
import { first_fulfilled } from '~/lib/data/fetch';

export const load: PageLoad = async ({ params, fetch }) => {
	repository.fetcher = fetch;

	const project_id = parseInt(params.pid);
	const chapter_id = parseInt(params.cid);

	let should_handle_scroll = true;

	const project = first_fulfilled(repository.get_project(project_id));
	const chapter = first_fulfilled(repository.get_chapter(project_id, chapter_id));
	const history = first_fulfilled(repository.get_history(project_id)).catch(() => {
		should_handle_scroll = false;
	});

	repository.fetcher = undefined;

	return {
		project: await project,
		chapter: await chapter,
		history: await history,
		should_handle_scroll,
	};
};
