<script lang="ts">
	import { AppHeader } from '~/components/App';
	import { ProjectChapterItem as ChapterItem } from '~/components/Chapter';
	import { Comment } from '~/components/Comment';
	import {
		IconEye,
		IconHeart,
		IconPlayerPlay,
		IconQuote,
		IconRocket,
		IconUser,
	} from '~/components/Icons';
	import { Modal } from '~/components/Modal';
	import { Tab, TabList, TabPanel, Tabs } from '~/components/Tabs';

	import { blur } from 'svelte/transition';
	import { browser } from '$app/env';
	import { repository } from '~/lib/data/repository';
	import { is_non_nullable } from '~/lib/utils/is';
	import { get_project_media, get_project_thumbnail, format_relase_date } from '~/lib/utils/neko';

	import type { ModalApi } from '~/components/Modal';
	import type { PageData } from './$types';
	import type { ProjectChapter } from '~/lib/types/nekopost';
	import type { HistoryEntity } from '~/lib/data/database';

	export let data: PageData;

	const dao_available$ = repository.dao_available$;

	const toggle_favorite = () => {
		if (!is_dao_available) return;

		if (is_favorite) {
			repository.del_favorite(info.id);
		} else {
			repository.put_favorite(info.id, {
				date_added: Date.now(),
				image_version: info.image_version,
				project_name: info.name,
				project_type: info.type,
				project_id: info.id,
			});
		}
	};

	const open_modal = (src: string) => {
		modal_img_src = src;
		modal_api.open();
	};

	const find_continue_chapter = (chapters: ProjectChapter[], history?: HistoryEntity) => {
		const curr_index = chapters.findIndex((e) => e.id === history?.chapter_id);

		if (curr_index === -1) {
			return chapters[chapters.length - 1];
		}

		return chapters[curr_index - (history?.progress === 1 ? 1 : 0)];
	}

	let modal_api: ModalApi;
	let modal_img_src = '';

	let continue_chapter: ProjectChapter | undefined;

	$: ({ chapters, info } = data.project);

	$: favorite$ = repository.get_favorite(info.id);
	$: history$ = repository.get_history(info.id);

	$: history = $history$;
	$: chp_one_third = Math.ceil(chapters.length / 3);
	$: thumbnial_url = get_project_thumbnail(info.id, info.image_version);
	$: is_favorite = is_non_nullable($favorite$);
	$: is_dao_available = $dao_available$;

	$: continue_chapter = find_continue_chapter(chapters, history);
</script>

<svelte:head>
	<title>{info.name}</title>
</svelte:head>

<AppHeader with_transparent />

<main>
	<div class="relative h-12 w-full">
		<div class="absolute inset-x-0 top-0 -bottom-56 overflow-hidden">
			<div
				class="absolute inset-0 bg-cover bg-[0_30%] blur-sm brightness-[.6] contrast-125 grayscale-[0.2]"
				style:background-image="url({thumbnial_url})"
			/>
			<div class="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
		</div>
	</div>

	<div
		class="relative mx-auto grid max-w-6xl grid-cols-[120px_1fr] grid-rows-[auto_auto_56px_auto] gap-3 p-4 pb-0 lg:grid-cols-[190px_1fr]"
	>
		<div class="row-start-1 row-end-4 aspect-[7/10] overflow-hidden rounded-md">
			<img
				alt=""
				src={thumbnial_url}
				class="h-full w-full cursor-zoom-in object-cover"
				on:click={() => open_modal(thumbnial_url)}
			/>
		</div>

		<div class="row-start-1 row-end-3 self-end lg:row-end-4">
			<h1 class="font-blod border-zinc-600 text-lg lg:border-b lg:pb-4 lg:text-3xl">
				{info.name}
			</h1>
		</div>

		<div class="lg:col-start-1 lg:row-start-4 lg:row-end-5 lg:gap-2 lg:py-2">
			<div class="grid grid-cols-[min-content_1fr] gap-1 rounded-md text-xs lg:text-sm">
				<IconUser size={16} class="lg:h-6 lg:w-6" />
				<span> {info.author}</span>
				<IconRocket size={16} class="lg:h-6 lg:w-6" />
				<span> {format_relase_date(info.release_date)}</span>
				<IconEye size={16} class="lg:h-6 lg:w-6" />
				<span> {info.views.toLocaleString()}</span>
			</div>
		</div>

		<div class="col-span-2 col-start-1 lg:col-span-1 lg:row-start-5 lg:row-end-6">
			{#if is_dao_available || !browser}
				<div class="grid grid-cols-2 gap-3">
					<button
						class="flex h-10 items-center justify-center px-4 font-medium text-white"
						class:text-sky-500={is_favorite}
						on:click={toggle_favorite}
					>
						<IconHeart fill={is_favorite ? 'currentColor' : 'none'} />
					</button>
					<a
						href={continue_chapter ? `/p/${info.id}/${continue_chapter?.id}` : '.'}
						class="flex h-10 w-full items-center justify-center px-4 font-medium"
					>
						<IconPlayerPlay />
					</a>
				</div>
			{/if}
		</div>

		<div class="col-span-2 lg:col-span-1 lg:col-start-2 lg:row-start-4 lg:row-end-7">
			<!-- <div class="hidden border-b border-zinc-600 lg:block" /> -->

			<div class="mb-3 grid grid-cols-[min-content_1fr] gap-3 lg:mt-3 lg:mb-6">
				<IconQuote size={14} />
				<blockquote class="flex text-xs lg:text-sm">
					{info.synopsis}
				</blockquote>

				<span />
				<ul class="flex flex-wrap gap-2 text-xs lg:text-sm">
					{#each info.categories as { name }}
						<li class="rounded-lg bg-zinc-600 px-3 py-1">{name}</li>
					{/each}
				</ul>
			</div>

			<Tabs class="min-h-[calc(100vh-4.5rem)]">
				<TabList>
					<Tab>ตอน</Tab>
					{#if info.medias.length}
						<Tab>ปก</Tab>
					{/if}
					<Tab>คอมเมนต์</Tab>
				</TabList>

				<TabPanel class="my-3 grid gap-3 lg:grid-cols-3 lg:gap-2">
					{#each Array(3) as _, i}
						<div class="grid gap-3">
							{#each chapters.slice(i * chp_one_third, i * chp_one_third + chp_one_third) as chapter (chapter.id)}
								<ChapterItem
									{chapter}
									project={info}
									current={history?.chapter_id === chapter.id}
								/>
							{/each}
						</div>
					{/each}
				</TabPanel>

				{#if info.medias.length}
					<TabPanel class="my-3 grid gap-2 lg:grid-cols-4">
						{#each info.medias as media}
							<img
								on:click={() => open_modal(get_project_media(info.id, media.filename))}
								class="w-full cursor-zoom-in rounded-md"
								src={get_project_media(info.id, media.filename)}
								alt=""
							/>
						{/each}
					</TabPanel>
				{/if}

				<TabPanel class="my-3">
					<Comment path="{info.type}/{info.id}" />
				</TabPanel>
			</Tabs>
		</div>
	</div>
</main>

<Modal bind:modal_api>
	<div
		class="flex h-full w-full items-center justify-center"
		transition:blur|local={{ duration: 50 }}
	>
		<img alt="" src={modal_img_src} class="max-h-full max-w-full" />
	</div>
</Modal>
