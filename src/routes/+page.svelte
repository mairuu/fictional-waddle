<script lang="ts">
	import { project_types } from '~/lib/types/nekopost';

	import { AppHeader } from '~/components/App';

	import LatestChapterList from './__latest-chapter-list.svelte';
	import RecentChapterList from './__recent-chapter-list.svelte';
</script>

<svelte:head>
	<title>หน้าหลัก</title>
</svelte:head>

<AppHeader />

<main class="mx-auto max-w-6xl px-4 pt-12">
	<RecentChapterList />

	{#each project_types as project_type}
		<LatestChapterList {project_type} />
	{/each}
</main>
