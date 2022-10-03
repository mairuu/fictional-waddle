import type { DateInput } from '~/lib/utils/date';

import { to_date } from '~/lib/utils/date';

export function get_project_thumbnail(project_id: number, image_version = '0') {
	return `https://www.osemocphoto.com/collectManga/${project_id}/${project_id}_cover.jpg?${image_version}`;
}

export function get_project_media(project_id: number, filename: string) {
	return `https://www.osemocphoto.com/collectManga/${project_id}/media/${filename}`;
}

export function get_chapter_image(project_id: number, chapter_id: number, filename: string) {
	return `/api/proxy?url=https://www.osemocphoto.com/collectManga/${project_id}/${chapter_id}/${filename}`;
}

function create_time_formatter(options?: Intl.DateTimeFormatOptions) {
	const formatter = Intl.DateTimeFormat('th', options);

	return (date: DateInput) => {
		return formatter.format(to_date(date));
	};
}

export const format_relase_date = create_time_formatter({
	year: 'numeric',
	month: 'short',
	day: 'numeric',
});

export const format_readt_at = create_time_formatter({
	hour: '2-digit',
	minute: '2-digit',
});

export const format_date = create_time_formatter({
	day: '2-digit',
	month: 'numeric',
	year: '2-digit',
});
