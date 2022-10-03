import type { ParamMatcher } from '@sveltejs/kit';

import { project_types } from '~/lib/types/nekopost';

export const match: ParamMatcher = (param: any) =>
	project_types.findIndex((cate) => cate[0] === param) !== -1;
