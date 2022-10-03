<script lang="ts">
	import type { PageData } from './$types';

	import { repository } from '~/lib/data/repository';
	import { get_project_thumbnail, format_relase_date } from '~/lib/utils/neko';

	import { AppHeader } from '~/components/App';
	import { IconEye, IconQuote, IconRocket, IconUser } from '~/components/Icons';

	import Actions from './__actions.svelte';
	import Tabs from './__tabs.svelte';

	export let data: PageData;

	$: ({ chapters, info } = data.project);

	$: favorite$ = repository.get_favorite(info.id);
	$: favorite = $favorite$;

	$: history$ = repository.get_history(info.id);
	$: history = $history$;

	$: thumbnial_url = get_project_thumbnail(info.id, info.image_version);
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
			<img alt="" src={thumbnial_url} class="h-full w-full cursor-zoom-in object-cover" />
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
			<Actions {info} {chapters} {history} {favorite} />
		</div>

		<div class="col-span-2 lg:col-span-1 lg:col-start-2 lg:row-start-4 lg:row-end-7">
			<div class="mb-3 grid grid-cols-[min-content_1fr] gap-3 lg:mt-3 lg:mb-6">
				<IconQuote size={14} />
				<blockquote class="flex text-xs lg:text-sm">
					{info.synopsis}
				</blockquote>

				<span />
				<ul class="flex flex-wrap gap-2 text-xs lg:text-sm">
					{#each info.categories as { cate_name }}
						<li class="rounded-lg bg-zinc-600 px-3 py-1">{cate_name}</li>
					{/each}
				</ul>
			</div>

			<Tabs {info} {chapters} {history} />
		</div>
	</div>
</main>
