<script lang="ts">
	import type { Chapter, Project } from '~/lib/types/nekopost';

	import { browser } from '$app/env';
	import { onMount } from 'svelte';
	import { repository } from '~/lib/data/repository';
	import { cal_progeress } from './+page.svelte';

	const push_activity = (project: Project, chapter: Chapter) => {
		if (!browser || !should_handle_scroll) return;

		repository.put_history(project.info.id, (old) => ({
			chapter_id: chapter.info.id,
			chapter_no: chapter.info.no,
			image_version: project.info.image_version,
			progress: old?.progress || -1,
			project_id: project.info.id,
			project_name: project.info.name,
			read_at: Date.now(),
		}));
	};

	const update_progress = () => {
		if (!browser || !content_elm) return;

		const progress = cal_progeress(content_elm);

		repository.put_history(project.info.id, (old) => ({
			chapter_id: chapter.info.id,
			chapter_no: chapter.info.no,
			image_version: project.info.image_version,
			progress,
			project_id: project.info.id,
			project_name: project.info.name,
			read_at: old?.read_at || -1,
		}));
	};

	onMount(() => {
		window.addEventListener('beforeunload', update_progress);

		return () => {
			update_progress();
			window.removeEventListener('beforeunload', update_progress);
		};
	});

	export let chapter: Chapter;
	export let project: Project;

	export let content_elm: HTMLElement;
	export let should_handle_scroll: boolean;

	$: push_activity(project, chapter);
</script>
