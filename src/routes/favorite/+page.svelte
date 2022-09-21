<script>
	import { repository } from '~/lib/data/repository';
	import { get_project_thumbnail } from '~/lib/utils/neko';

	import { AppHeader } from '~/components/App';
	import { ProjectCard } from '~/components/Card';

	const favorites$ = repository.get_favorites();
</script>

<svelte:head>
	<title>ชื่นชอบ</title>
</svelte:head>

<AppHeader />

<main class="mx-auto max-w-6xl px-4 pt-12">
	<div class="mb-8 grid grid-cols-3 gap-2 pt-4 sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))]">
		{#each $favorites$ || [] as { image_version, project_name, project_id } (project_id)}
			<ProjectCard
				link="/p/{project_id}"
				title={project_name}
				thumbnail={get_project_thumbnail(project_id, image_version)}
			/>
		{/each}
	</div>
</main>
