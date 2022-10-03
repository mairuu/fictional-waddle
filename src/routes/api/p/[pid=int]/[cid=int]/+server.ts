import type { RequestHandler } from '@sveltejs/kit';
import type { Chapter, ChapterContent } from '~/lib/types/nekopost';

import { json, error } from '@sveltejs/kit';
import { noop } from '~/lib/utils/noop';

const normalize_content = (raw: any): ChapterContent => {
	if (raw.pageItem)
		return {
			type: 'image',
			data: raw.pageItem.map((e: any) => ({
				filename: e.pageName || e.fileName,
				width: e.width,
				height: e.height,
			})),
		};

	return {
		type: 'text',
		data: raw.pageText || raw.novelContent,
	};
};

export const GET: RequestHandler = async ({ params }) => {
	const project_id = params.pid;
	const chapter_id = params.cid;

	const dest = new URL(
		`/collectManga/${project_id}/${chapter_id}/${project_id}_${chapter_id}.json`,
		'https://www.osemocphoto.com'
	);

	const req_headers = new Headers();
	req_headers.set('host', dest.host);
	req_headers.set('referer', 'https://www.nekopost.net/');

	try {
		const response = await fetch(dest, { headers: req_headers });
		const data = await response.json().catch(noop);

		if (!data) throw new Error('Chapter dose not exists!');

		const info = {
			id: parseInt(data.chapterId),
			no: data.chapterNo,
			project_id: parseInt(data.projectId),
		};
		const content = normalize_content(data);

		const chapter: Chapter = { info, content };

		return json(chapter, { headers: { 'cache-control': 'public, max-age=300' } });
	} catch (err) {
		throw error(500, err?.toString());
	}
};
