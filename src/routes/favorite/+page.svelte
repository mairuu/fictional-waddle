<script lang="ts" context="module">
	const favorites$ = repository.get_favorites();
</script>

<script lang="ts">
	import { repository } from '~/lib/data/repository';
	import { is_resource_error } from '~/lib/utils/resource';
	import { get_project_thumbnail } from '~/lib/utils/neko';

	import { AppHeader } from '~/components/App';
	import { ProjectCard, ProjectCardSkeleton } from '~/components/Card';
	import { Expression } from '~/components/Expression';

	$: favorites = $favorites$;
</script>

<svelte:head>
	<title>ชื่นชอบ</title>
</svelte:head>

<AppHeader />

<main class="mx-auto max-w-6xl px-4 pt-12">
	{#if is_resource_error(favorites)}
		<Expression>
			<span slot="face">（；へ：）</span>
			<span slot="desc">แย่ล่ะ</span>
		</Expression>
	{:else if favorites.data?.length === 0}
		<Expression>
			<span slot="face">( ´･_･`)</span>
			<span slot="desc"> ยังไม่มีอะไรเลย...</span>
		</Expression>
	{:else}
		<div
			class="mb-8 grid grid-cols-3 gap-2 pt-4 sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))]"
		>
			{#if favorites.data}
				{#each favorites.data as { image_version, project_name, project_id } (project_id)}
					<ProjectCard
						link="/p/{project_id}"
						title={project_name}
						thumbnail={get_project_thumbnail(project_id, image_version)}
					/>
				{/each}
			{:else}
				{#each Array(6) as _}
					<ProjectCardSkeleton />
				{/each}
			{/if}
		</div>
	{/if}
</main>
