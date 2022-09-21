<script lang="ts">
	import { repository } from '~/lib/data/repository';
	import { project_type_lang } from '~/lib/types/nekopost';
	import { get_project_thumbnail } from '~/lib/utils/neko';

	import { AppHeader } from '~/components/App';
	import { ProjectCard } from '~/components/Card';
	import { Readable } from '~/components/Container';
	import { Skeleton } from '~/components/Skeleton';

	import type { PageData } from './$types';

	export let data: PageData;

	const next_entry = (index: number) => repository.get_latest_chapters(data.project_type, index);

	const load_more = () => {
		entries.push(next_entry(entries.length));
		entries = entries;
	};

	let entries = [next_entry(0), next_entry(1)];

	$: title = `${project_type_lang[data.project_type]}ล่าสุด`;
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<AppHeader />

<main class="mx-auto max-w-6xl px-4 pt-12">
	<h3 class="my-4 text-2xl font-bold">{title}</h3>
	<div class="mb-8 grid grid-cols-3 gap-2 sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))]">
		{#each entries as entry (entry)}
			<Readable readable={entry} let:data={resource}>
				{#if resource.is_loading}
					{#each Array(12) as _} <Skeleton class="aspect-[2/3] rounded-md" /> {/each}
				{:else if resource.is_error}
					<!-- <div></div> -->
				{:else}
					{#each resource.data as { id, image_version, name }}
						<ProjectCard
							thumbnail={get_project_thumbnail(id, image_version)}
							link="/p/{id}"
							title={name}
						/>
					{/each}
				{/if}
			</Readable>
		{/each}

		<button class="col-span-full mt-4 rounded-md bg-zinc-800 p-4" on:click={load_more}>
			โหลดเพิ่ม
		</button>
	</div>
</main>
