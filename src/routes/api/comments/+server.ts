import { error } from '@sveltejs/kit';

import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const path = url.searchParams.get('path');
	const sort = url.searchParams.get('sort');

	if (!path || !sort) throw error(400);

	const dest = new URL('/api/v1/find', 'https://kuro.nekopost.net');

	const req_headers = new Headers();
	req_headers.set('host', dest.host);
	req_headers.set('referer', 'https://www.nekopost.net/');

	const search = dest.searchParams;
	search.set('site', 'remark');
	search.set('url', new URL(path, 'https://www.nekopost.net').toString());
	search.set('sort', sort);
	search.set('format', 'tree');

	const response = await fetch(dest, { headers: req_headers });

	return new Response(response.body, {
		headers: { 'content-type': 'application/json' },
	});
};
