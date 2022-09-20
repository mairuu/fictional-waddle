<script lang="ts">
	import { onDestroy } from 'svelte';
	import { browser } from '$app/env';
	import { afterNavigate, disableScrollHandling } from '$app/navigation';
	import { clamp } from '~/lib/utils/math';
	import { get_chapter_image } from '~/lib/utils/neko';
	import { repository } from '~/lib/data/repository';

	import { AppHeader } from '~/components/App';
	import { Comment } from '~/components/Comment';
	import { IconList } from '~/components/Icons';
	import { LazyImage } from '~/components/Lazy';

	import type { PageData } from './$types';
	import type { Chapter, Project } from '~/lib/types/nekopost';
	import type { HistoryEntity } from '~/lib/data/database';

	export let data: PageData;

	const dao_available$ = repository.dao_available$;

	const cal_scroll_y = (content_elm: HTMLElement, progress: number) => {
		return progress * (content_elm.clientHeight - window.innerHeight) + content_elm.offsetTop;
	};

	const cal_progeress = (content_elm: HTMLElement) => {
		const progress =
			(window.scrollY - content_elm.offsetTop) / (content_elm.clientHeight - window.innerHeight);

		return clamp(0, progress, 1);
	};

	const handle_scroll_restoration = (
		history: HistoryEntity | undefined,
		chapter: Chapter,
		element: HTMLElement | undefined
	) => {
		if (!element) return;

		if (is_dao_available) disableScrollHandling();

		if (history && history.chapter_id === chapter.info.id) {
			window.scrollTo({ top: cal_scroll_y(element, history.progress), left: 0 });
		} else {
			window.scrollTo({ top: 0, left: 0 });
		}
	};

	const push_activity = (project: Project, chapter: Chapter) => {
		if (!browser) return;

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

	const update_progress = (project: Project, chapter: Chapter, element?: HTMLElement) => {
		if (!browser || !element) return;

		const progress = cal_progeress(element);

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

	onDestroy(() => update_progress(project, chapter, content_elm));

	let content_elm: HTMLElement;

	$: ({ chapter, project, hisotry } = data);

	$: curr_chapter_index = project.chapters.findIndex((e) => e.id === chapter.info.id);
	$: next_chapter = project.chapters.at(curr_chapter_index - 1);
	$: is_dao_available = $dao_available$;

	$: push_activity(project, chapter);
	$: handle_scroll_restoration(hisotry, chapter, content_elm);
</script>

<svelte:head>
	<title>Ch.{chapter.info.no} - {project.info.name}</title>
	<link
		href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<AppHeader>
	<div class="flex h-full">
		<a href="/p/{project.info.id}" class="flex h-full items-center self-center px-4">
			<div class="flex-0">
				<IconList />
			</div>
			<span class="ml-4 flex-1 line-clamp-1">{project.info.name}</span>
		</a>
	</div>
</AppHeader>

<main class="pt-12">
	<div class="my-6 mx-auto max-w-[600px] px-4">
		<h1 class="my-6 mx-4 text-center text-3xl font-bold leading-10">
			{project.chapters[curr_chapter_index].name}
		</h1>
		<hr class="my-6" />
	</div>

	{#if chapter.content.type === 'image'}
		<div class="image--content my-6 flex flex-col items-center gap-1" bind:this={content_elm}>
			{#each chapter.content.data as e (e.filename)}
				<LazyImage
					src={get_chapter_image(project.info.id, chapter.info.id, e.filename)}
					width={e.width}
					height={e.height}
				/>
			{/each}
		</div>
	{/if}

	{#if chapter.content.type === 'text'}
		<div class="mx-auto my-6 max-w-[600px] font-[Sarabun] text-xl font-light">
			<div class="text--content my-6 overflow-hidden px-4" bind:this={content_elm}>
				{@html chapter.content.data}
			</div>
		</div>
	{/if}

	<div class="mx-auto max-w-[600px] px-4">
		<div class="my-16 border-t border-zinc-500" />

		<a
			href="/p/{project.info.id}/{next_chapter?.id || ''}"
			class="flex min-h-[5rem] items-center justify-center border-2 border-dashed border-white/30 px-4 py-1  opacity-50 transition-opacity hover:bg-white/10 hover:opacity-80"
		>
			{next_chapter ? 'ตอนถัดไป' : 'กลับ'}
		</a>

		<div class="my-16 border-t border-zinc-500" />

		<Comment path="{project.info.type}/{project.info.id}/{chapter.info.no}" />

		<div class="my-16 border-t border-zinc-500" />
	</div>
</main>

<style global>
	.text--content h1,
	.text--content h2,
	.text--content h3,
	.text--content h4,
	.text--content h5,
	.text--content h6,
	.text--content p,
	.text--content img {
		margin-bottom: 1rem;
	}

	.text--content span {
		color: inherit !important;
	}

	.text--content img {
		width: 100% !important;
		height: unset !important;
	}
</style>
