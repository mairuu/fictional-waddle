import type { ProjectType } from '~/lib/types/nekopost';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const project_type = params.type as ProjectType;
	return { project_type };
};
