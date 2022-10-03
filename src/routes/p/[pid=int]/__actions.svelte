<script lang="ts">
	import type { FavoriteEntity, HistoryEntity } from '~/lib/data/database';
	import type { ProjectChapter, ProjectInfo } from '~/lib/types/nekopost';
	import type { Resource } from '~/lib/utils/resource';

	import { is_non_nullable } from '~/lib/utils/is_non_nullable';
	import { is_resource_error } from '~/lib/utils/resource';
	import { repository } from '~/lib/data/repository';

	import { IconHeart, IconPlayerPlay } from '~/components/Icons';

	export let info: ProjectInfo;
	export let chapters: ProjectChapter[];

	export let history: Resource<HistoryEntity>;
	export let favorite: Resource<FavoriteEntity>;

	const toggle_favorite = () => {
		if (is_favorited) {
			repository.del_favorite(info.id);
		} else {
			repository.put_favorite(info.id, {
				date_added: Date.now(),
				image_version: info.image_version,
				project_name: info.name,
				project_type: info.type,
				project_id: info.id,
			});
		}
	};

	const find_continue_chapter = (
		chapters: ProjectChapter[],
		history: HistoryEntity | null
	): ProjectChapter | undefined => {
		const curr_index = chapters.findIndex((e) => e.id === history?.chapter_id);

		if (curr_index === -1) {
			return chapters[chapters.length - 1];
		}

		if (history?.progress === 1) {
			return chapters[curr_index - 1] || chapters[curr_index];
		}

		return chapters[curr_index];
	};

	$: continue_chapter = find_continue_chapter(chapters, history.data);
	$: is_favorited = is_non_nullable(favorite.data);
</script>

{#if !is_resource_error(favorite)}
	<div class="grid grid-cols-2 gap-3">
		<button
			class="flex h-10 items-center justify-center px-4 font-medium text-white"
			class:text-sky-500={is_favorited}
			on:click={toggle_favorite}
		>
			<IconHeart fill={is_favorited ? 'currentColor' : 'none'} size={18} class="lg:h-6 lg:w-6" />
		</button>
		<a
			href={continue_chapter ? `/p/${info.id}/${continue_chapter?.id}` : undefined}
			class="flex h-10 w-full items-center justify-center px-4 font-medium"
			class:text-zinc-600={!continue_chapter}
			title={continue_chapter?.name}
		>
			<IconPlayerPlay size={18} class="lg:h-6 lg:w-6" />
		</a>
	</div>
{/if}
