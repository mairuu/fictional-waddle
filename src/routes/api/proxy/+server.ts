import { error } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async (ev) => {
	const _url = ev.url.searchParams.get('url');
	if (!_url) throw error(400);

	const dest = new URL(_url);

	const req_headers = new Headers();
	req_headers.set('host', dest.host);
	req_headers.set('referer', 'https://www.nekopost.net/');

	return await fetch(dest, { headers: req_headers });
};
