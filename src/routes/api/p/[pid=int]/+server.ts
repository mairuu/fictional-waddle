import { error, type RequestHandler } from '@sveltejs/kit';
import type {
	Project,
	ProjectCategory,
	ProjectChapter,
	ProjectInfo,
	ProjectMedia,
	ProjectProvider,
} from '~/lib/types/nekopost';

import { json } from '@sveltejs/kit';

// prettier-ignore
function project_type(type: string): any {
	switch(type[0])
	{ 
		case 'm': return 'manga'
		case 'f':
		case 'n': return 'novel'
		case 'c':
		case 'd': return 'comic'
	}
	
	throw new Error('unknown project type')
}

export const GET: RequestHandler = async ({ params }) => {
	const project_id = params.pid;

	const dest = new URL(`/frontAPI/getProjectInfo/${project_id}`, 'https://api.osemocphoto.com');

	const req_headers = new Headers();
	req_headers.set('host', dest.host);
	req_headers.set('referer', 'https://www.nekopost.net/');

	try {
		const response = await fetch(dest, { headers: req_headers });
		const data = await response.json();

		if (!data.projectInfo) throw new Error('Project dose not exists!');

		const medias: ProjectMedia[] =
			data?.listMedia?.map((e: any) => ({
				filename: e.fileName,
			})) || [];
		const providers: ProjectProvider[] =
			data?.listProvider?.map((e: any) => ({
				user_id: e.userId,
				user_name: e.displayName,
			})) || [];
		const categories: ProjectCategory[] =
			data?.listCate?.map((e: any) => ({
				cate_id: e.cateCode,
				cate_name: e.cateName,
			})) || [];
		const info: ProjectInfo = {
			id: parseInt(data.projectInfo.projectId),
			name: data.projectInfo.projectName,
			type: project_type(data.projectInfo.projectType),
			artist: data.projectInfo.artistName,
			author: data.projectInfo.authorName,
			image_version: data.projectInfo.imageVersion,
			release_date: data.projectInfo.releaseDate,
			synopsis: data.projectInfo.info,
			views: parseInt(data.projectInfo.views),

			medias,
			providers,
			categories,
		};

		const chapters: ProjectChapter[] =
			data?.listChapter?.map((e: any) => ({
				id: parseInt(e.chapterId),
				no: e.chapterNo,
				name: e.chapterName,
				provider: e.providerName,
				create_date: e.createDate,
			})) || [];

		const project: Project = { chapters, info };

		return json(project, { headers: { 'cache-control': 'public, max-age=300' } });
	} catch (err) {
		throw error(500, err?.toString());
	}
};
