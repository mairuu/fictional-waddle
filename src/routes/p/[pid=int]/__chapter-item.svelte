<svelte:options immutable />

<script lang="ts">
	import type { ProjectChapter, ProjectInfo } from '~/lib/types/nekopost';

	import { is_today } from '~/lib/utils/date';
	import { format_relase_date } from '~/lib/utils/neko';

	interface $$Props extends svelte.JSX.HTMLProps<HTMLElement> {
		chapter: ProjectChapter;
		project: ProjectInfo;
		is_active?: boolean;
	}

	export let chapter: ProjectChapter;
	export let project: ProjectInfo;
	export let is_active = false;
</script>

<a
	{...$$restProps}
	href="/p/{project.id}/{chapter.id}"
	class="group flex self-start {$$props.class || ''}"
	title={chapter.name}
>
	<div class="min-w-[3rem] self-center px-2 text-center">{chapter.no}</div>
	<div>
		<div class="text-sm group-visited:text-sky-400" class:!text-green-500={is_active}>
			{chapter.name}
		</div>
		<div class="flex text-xs">
			<span class="line-clamp-1">{chapter.provider}</span>&nbsp;
			<div class="flex-shrink-0 text-zinc-500">
				<span> ·</span>
				{format_relase_date(chapter.create_date)}
			</div>
		</div>
	</div>
	{#if is_today(chapter.create_date)}
		<div class="ml-auto self-center pl-2 text-center text-xs italic text-green-500">อัพ</div>
	{/if}
</a>
