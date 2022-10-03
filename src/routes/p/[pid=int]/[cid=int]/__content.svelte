<script lang="ts">
	import type { Chapter, Project } from '~/lib/types/nekopost';

	import { get_chapter_image } from '~/lib/utils/neko';

	import { LazyImage } from '~/components/Lazy';

	export let chapter: Chapter;
	export let project: Project;

	export let content_elm: HTMLElement;
</script>

{#if chapter.content.type === 'image'}
	<div class="image--content flex flex-col items-center gap-1" bind:this={content_elm}>
		{#each chapter.content.data as e (e.filename)}
			<LazyImage
				src={get_chapter_image(project.info.id, chapter.info.id, e.filename)}
				width={e.width}
				height={e.height}
			/>
		{/each}
	</div>
{/if}

{#if chapter.content.type === 'text'}
	<div class="mx-auto max-w-[600px]">
		<div
			class="text--content overflow-hidden px-4 font-[Sarabun] text-xl font-light leading-8"
			bind:this={content_elm}
		>
			{@html chapter.content.data}
		</div>
	</div>
{/if}

<style global>
	.text--content h1,
	.text--content h2,
	.text--content h3,
	.text--content h4,
	.text--content h5,
	.text--content h6,
	.text--content p,
	.text--content img {
		margin-bottom: 1rem;
	}

	.text--content span {
		color: inherit !important;
	}

	.text--content img {
		width: 100% !important;
		height: unset !important;
	}
</style>
