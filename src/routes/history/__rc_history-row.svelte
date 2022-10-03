<script lang="ts">
	import type { HistoryEntity } from '~/lib/data/database';

	import { format_readt_at, get_project_thumbnail } from '~/lib/utils/neko';
	import { repository } from '~/lib/data/repository';

	import { IconPlayerPlay, IconTrash } from '~/components/Icons';

	export let data: HistoryEntity;

	$: ({ chapter_id, chapter_no, image_version, project_id, project_name, read_at } = data);
</script>

<div class="relative flex">
	<a href="/p/{project_id}" class="relative flex flex-1 gap-x-3 pr-2">
		<img
			src={get_project_thumbnail(project_id, image_version)}
			alt=""
			class="aspect-[2/3] w-16 rounded-md object-cover object-top"
		/>
		<div class="flex-1 self-center text-xs">
			<strong class="line-clamp-2"> {project_name} </strong>
			<span class="block pt-1">Ch. {chapter_no} - {format_readt_at(read_at)}</span>
		</div>
	</a>

	<button
		class="flex-0 flex items-center px-2 hover:text-red-500"
		on:click={() => repository.del_history(project_id)}
	>
		<IconTrash />
	</button>

	<a class="flex-0 flex items-center pl-2 hover:text-green-500" href="/p/{project_id}/{chapter_id}">
		<IconPlayerPlay />
	</a>
</div>
