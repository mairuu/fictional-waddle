export const get_project_thumbnail = (project_id: number, image_version = '0') => {
	return `https://www.osemocphoto.com/collectManga/${project_id}/${project_id}_cover.jpg?${image_version}`;
};

export const get_project_media = (project_id: number, filename: string) => {
	return `https://www.osemocphoto.com/collectManga/${project_id}/media/${filename}`;
};

export const get_chapter_image = (project_id: number, chapter_id: number, filename: string) => {
	return `/api/proxy?url=https://www.osemocphoto.com/collectManga/${project_id}/${chapter_id}/${filename}`;
};
