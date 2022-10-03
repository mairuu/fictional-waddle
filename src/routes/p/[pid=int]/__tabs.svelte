<script lang="ts">
	import type { HistoryEntity } from '~/lib/data/database';
	import type { ProjectChapter, ProjectInfo } from '~/lib/types/nekopost';
	import type { Resource } from '~/lib/utils/resource';

	import { get_project_media } from '~/lib/utils/neko';

	import { Comment } from '~/components/Comment';
	import { Tab, TabList, TabPanel, Tabs } from '~/components/Tabs';

	import ChapterItem from './__chapter-item.svelte';

	export let info: ProjectInfo;
	export let chapters: ProjectChapter[];
	export let history: Resource<HistoryEntity>;

	$: k = Math.ceil(chapters.length / 3);
	$: has_media = info.medias.length !== 0;
</script>

<Tabs class="min-h-[calc(100vh-4.5rem)] pb-4">
	<TabList>
		<Tab>ตอน</Tab>
		{#if has_media}
			<Tab>ปก</Tab>
		{/if}
		<Tab>คอมเมนต์</Tab>
	</TabList>

	<TabPanel class="my-3 grid gap-3 lg:grid-cols-3 lg:gap-2">
		{#each Array(3) as _, i}
			<div class="grid gap-3">
				{#each chapters.slice(i * k, i * k + k) as chapter (chapter.id)}
					<ChapterItem
						{chapter}
						project={info}
						is_active={history.data?.chapter_id === chapter.id}
					/>
				{/each}
			</div>
		{/each}
	</TabPanel>

	{#if has_media}
		<TabPanel class="my-3 grid gap-2 lg:grid-cols-4">
			{#each info.medias as media}
				<img
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
