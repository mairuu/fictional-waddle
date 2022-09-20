import { project_types } from '~/lib/types/nekopost';
import type { ParamMatcher } from '@sveltejs/kit';

export const match: ParamMatcher = (param: any) => project_types.includes(param);
