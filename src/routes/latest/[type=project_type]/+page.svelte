<script lang="ts">
	import type { PageData } from './$types';

	import { browser } from '$app/env';
	import { repository } from '~/lib/data/repository';
	import { project_type_lang } from '~/lib/types/nekopost';
	import { get_project_thumbnail } from '~/lib/utils/neko';
	import { is_resource_fulfilled } from '~/lib/utils/resource';

	import { AppHeader } from '~/components/App';
	import { ProjectCard } from '~/components/Card';
	import { Readable } from '~/components/Container';
	import { Skeleton } from '~/components/Skeleton';

	export let data: PageData;

	const next_entry = (index: number) => repository.get_latest_chapters(data.project_type, index);

	const load_more = () => {
		entries.push(next_entry(entries.length));
		entries = entries;
	};

	let entries = browser ? [next_entry(0), next_entry(1)] : [];

	$: title = `${project_type_lang[data.project_type]}ล่าสุด`;
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<AppHeader />

<main class="mx-auto max-w-6xl px-4 pt-12">
	<h3 class="my-4 text-2xl font-bold">{title}</h3>
	<div class="mb-8 grid grid-cols-3 gap-2 sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))]">
		{#if browser}
			{#each entries as entry (entry)}
				<Readable readable={entry} let:data={resource}>
					{#if is_resource_fulfilled(resource)}
						{#each resource.data as { id, image_version, name }}
							<ProjectCard
								thumbnail={get_project_thumbnail(id, image_version)}
								link="/p/{id}"
								title={name}
							/>
						{/each}
					{:else}
						{#each Array(12) as _} <Skeleton class="aspect-[2/3] rounded-md" /> {/each}
					{/if}
				</Readable>
			{/each}
		{:else}
			{#each Array(24) as _}<Skeleton class="aspect-[2/3] rounded-md" /> {/each}
		{/if}

		<button class="col-span-full mt-4 rounded-md bg-zinc-800 p-4" on:click={load_more}>
			โหลดเพิ่ม
		</button>
	</div>
</main>
