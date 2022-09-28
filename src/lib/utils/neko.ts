import { to_date, type DateInput } from './date';

export function get_project_thumbnail(project_id: number, image_version = '0') {
	return `https://www.osemocphoto.com/collectManga/${project_id}/${project_id}_cover.jpg?${image_version}`;
}

export function get_project_media(project_id: number, filename: string) {
	return `https://www.osemocphoto.com/collectManga/${project_id}/media/${filename}`;
}

export function get_chapter_image(project_id: number, chapter_id: number, filename: string) {
	return `/api/proxy?urlhttps://www.osemocphoto.com/collectManga/${project_id}/${chapter_id}/${filename}`;
}

function time_format(options?: Intl.DateTimeFormatOptions) {
	const formatter = Intl.DateTimeFormat('th', options);
	return (date: DateInput) => formatter.format(to_date(date));
}

export const format_relase_date = time_format({ year: 'numeric', month: 'short', day: 'numeric' });

export const format_readt_at = time_format({ hour: '2-digit', minute: '2-digit' });

export const format_date = time_format({ day: '2-digit', month: 'numeric', year: '2-digit' });
