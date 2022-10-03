import type { PageLoad } from './$types';
import type { ProjectType } from '~/lib/types/nekopost';

export const load: PageLoad = async ({ params }) => {
	const project_type = params.type as ProjectType;
	return { project_type };
};
