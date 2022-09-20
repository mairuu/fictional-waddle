import { project_types } from '~/lib/types/nekopost';
import type { ParamMatcher } from '@sveltejs/kit';

export const match: ParamMatcher = (param: any) =>
	project_types.findIndex((cate) => cate[0] === param) !== -1;
