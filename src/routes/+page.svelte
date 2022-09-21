<script lang="ts" context="module">
	const histories$ = repository.get_histories({ take: 6 });
</script>

<script lang="ts">
	import { repository } from '~/lib/data/repository';
	import { project_types } from '~/lib/types/nekopost';
	import { get_project_thumbnail } from '~/lib/utils/neko';

	import { AppHeader } from '~/components/App';
	import { LatestChapterList } from '~/components/Chapter';
	import { Skeleton } from '~/components/Skeleton';

	$: histories = $histories$ || [];
</script>

<svelte:head>
	<title>หน้าหลัก</title>
</svelte:head>

<AppHeader />

<main class="mx-auto max-w-6xl px-4 pt-12">
	<h3 class="my-4 text-2xl font-bold">เมื่อเร็วๆนี้</h3>

	<div class="mb-8 grid grid-cols-2 gap-2 lg:grid-cols-3">
		{#each histories as { project_id, project_name, image_version }}
			<a
				href="/p/{project_id}"
				title={project_name}
				class="relative flex h-16 overflow-hidden rounded-md md:h-20"
			>
				<img
					src={get_project_thumbnail(project_id, image_version)}
					alt=""
					class="aspect-square object-cover object-top"
				/>
				<div class="flex-1 self-center px-3 text-xs sm:text-sm">
					<strong class="line-clamp-2"> {project_name} </strong>
				</div>
			</a>
		{/each}
		{#each Array(6 - histories.length) as _}
			<Skeleton class="relative flex h-16 overflow-hidden rounded-md md:h-20" />
		{/each}
	</div>

	{#each project_types as project_type}
		<LatestChapterList {project_type} />
	{/each}
</main>
