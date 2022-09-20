import { first_fulfilled } from '~/lib/data/fetch';
import { repository } from '~/lib/data/repository';

import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
	repository.fetcher = fetch;

	const project_id = parseInt(params.pid);
	const project = await first_fulfilled(repository.get_project(project_id));

	return { project };
};
