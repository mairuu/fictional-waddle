import type { ProjectType } from '~/lib/types/nekopost';

export interface HistoryEntity {
	chapter_id: number;
	chapter_no: string;
	project_id: number;
	project_name: string;

	read_at: number;
	progress: number;
	image_version: string;
}

export interface FavoriteEntity {
	date_added: number;
	project_id: number;
	project_name: string;
	project_type: ProjectType;
	image_version: string;
}
