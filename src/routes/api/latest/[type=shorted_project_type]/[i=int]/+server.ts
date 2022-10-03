import type { RequestHandler } from '@sveltejs/kit';

import { json, error } from '@sveltejs/kit';

const ITEM_PER_PAGE = 12;

export const GET: RequestHandler = async ({ params }) => {
	const type = params.type;
	const index = parseInt(params.i);
	const offset = ITEM_PER_PAGE * index;

	const dest = new URL(
		`/frontAPI/getLatestChapterF3/${type}/0/${ITEM_PER_PAGE}/${offset}`,
		'https://api.osemocphoto.com'
	);

	const req_headers = new Headers();
	req_headers.set('host', dest.host);
	req_headers.set('referer', 'https://www.nekopost.net/');

	try {
		const response = await fetch(dest, { headers: req_headers });

		const data = await response.json();
		const projects = data.listChapter.map((e: any) => ({
			id: e.projectId,
			name: e.projectName,
			image_version: e.imageVersion,
		}));

		return json(projects, { headers: { 'cache-control': 'public, max-age=300' } });
	} catch (err) {
		throw error(500, err?.toString());
	}
};
