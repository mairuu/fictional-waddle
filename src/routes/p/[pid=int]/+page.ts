import type { PageLoad } from './$types';

import { first_fulfilled } from '~/lib/data/fetch';
import { repository } from '~/lib/data/repository';

export const load: PageLoad = async ({ params, fetch }) => {
	repository.fetcher = fetch;

	const project_id = parseInt(params.pid);

	const project = first_fulfilled(repository.get_project(project_id));

	repository.fetcher = undefined;

	return {
		project: await project,
	};
};
