export type ProjectType = typeof project_types[number];

export interface ProjectInfo {
	id: number;
	name: string;
	type: ProjectType;
	author: string;
	artist: string;
	synopsis: string;
	views: number;
	release_date: string;
	image_version: string;

	medias: ProjectMedia[];
	providers: ProjectProvider[];
	categories: ProjectCategory[];
}

export interface ProjectChapter {
	id: number;
	no: string;
	name: string;
	provider: string;
	create_date: string;
}

export interface ProjectProvider {
	id: string;
	name: string;
}

export interface ProjectCategory {
	id: string;
	name: string;
}

export interface ProjectMedia {
	filename: string;
}

export interface Project {
	info: ProjectInfo;
	chapters: ProjectChapter[];
}

export interface Chapter {
	info: {
		id: number;
		no: string;
		project_id: number;
	};
	content: ChapterContent;
}

export type ChapterContent = ChapterImageContent | ChapterTextContent;

export interface ChapterImageContent {
	type: 'image';
	data: {
		filename: string;
		width: number;
		height: number;
	}[];
}

export interface ChapterTextContent {
	type: 'text';
	data: string;
}

export interface LatestChapter {
	id: number;
	name: string;
	image_version: string;
}

export const project_types = ['comic', 'manga', 'novel'] as const;

export const project_type_lang = { manga: 'มังงะ', novel: 'โนเวล', comic: 'คอมมิก' };
