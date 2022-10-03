<script lang="ts" context="module">
	export const cal_scroll_y = (content_elm: HTMLElement, progress: number) => {
		const scroll_y =
			content_elm.offsetTop -
			APP_BAR_HEIGHT +
			progress * (content_elm.clientHeight - window.innerHeight + APP_BAR_HEIGHT);

		return scroll_y;
	};

	export const cal_progeress = (content_elm: HTMLElement) => {
		const progress =
			(window.scrollY - content_elm.offsetTop + APP_BAR_HEIGHT) /
			(content_elm.clientHeight - window.innerHeight + APP_BAR_HEIGHT);

		return clamp(0, progress, 1);
	};
</script>

<script lang="ts">
	import type { PageData } from './$types';

	import { clamp } from '~/lib/utils/math';

	import { AppHeader, APP_BAR_HEIGHT } from '~/components/App';
	import { Comment } from '~/components/Comment';
	import { IconList } from '~/components/Icons';

	import ActivityHandler from './__activity-handler.svelte';
	import ScrollHandler from './__scroll-handler.svelte';
	import Content from './__content.svelte';

	export let data: PageData;

	let content_elm: HTMLElement;

	$: ({ chapter, project, should_handle_scroll, history } = data);

	$: curr_chapter_index = project.chapters.findIndex((e) => e.id === chapter.info.id);
	$: next_chapter = project.chapters[curr_chapter_index - 1];
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

<ActivityHandler {chapter} {content_elm} {project} {should_handle_scroll} />
<ScrollHandler {history} {chapter} {content_elm} {should_handle_scroll} />

<main class="pt-12">
	<header class="my-16 mx-auto max-w-[600px] px-4">
		<h1 class="my-16 mx-4 text-center text-3xl font-bold leading-10">
			{project.chapters[curr_chapter_index].name}
		</h1>
		<hr class="my-16" />
	</header>

	<Content {chapter} {project} bind:content_elm />

	<div class="mx-auto max-w-[600px] px-4">
		<div class="my-16 border-t border-zinc-500" />

		{#if next_chapter}
			<a
				href="/p/{project.info.id}/{next_chapter.id}"
				class="flex min-h-[5rem] items-center justify-center border-2 border-dashed border-white/30 px-4 py-1 opacity-50 transition-opacity hover:bg-white/10 hover:opacity-80"
			>
				ตอนถัดไป
			</a>

			<div class="my-16 border-t border-zinc-500" />
		{/if}

		<Comment path="{project.info.type}/{project.info.id}/{chapter.info.no}" />

		<div class="my-16 border-t border-zinc-500" />
	</div>
</main>
