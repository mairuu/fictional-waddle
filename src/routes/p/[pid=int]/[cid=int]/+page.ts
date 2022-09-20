import { repository } from '~/lib/data/repository';
import { first_fulfilled } from '~/lib/data/fetch';
import type { PageLoad } from './$types';
import { first_of } from '~/lib/store';

export const load: PageLoad = async ({ params, fetch }) => {
	repository.fetcher = fetch;

	const project_id = parseInt(params.pid);
	const chapter_id = parseInt(params.cid);

	const project = first_fulfilled(repository.get_project(project_id));
	const chapter = first_fulfilled(repository.get_chapter(project_id, chapter_id));
	const hisotry = first_of(repository.get_history(project_id));

	return {
		project: await project,
		chapter: await chapter,
		hisotry: await hisotry,
	};
};
