import type { ParamMatcher } from '@sveltejs/kit';

import { project_types } from '~/lib/types/nekopost';

export const match: ParamMatcher = (param: any) => project_types.includes(param);
