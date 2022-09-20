<script lang="ts">
	import { repository } from '~/lib/data/repository';
	import { is_same_day, is_today } from '~/lib/utils/date';
	import { get_project_thumbnail } from '~/lib/utils/neko';

	import { AppHeader } from '~/components/App';
	import { IconPlayerPlay, IconTrash } from '~/components/Icons';

	const histories$ = repository.get_histories();

	const read_at_formatter = Intl.DateTimeFormat('th', {
		hour: '2-digit',
		minute: '2-digit',
	});

	const day_formatter = Intl.DateTimeFormat('th', {
		day: '2-digit',
		month: 'numeric',
		year: '2-digit',
	});

	const format_header = (n: number) => {
		if (is_today(n)) return 'วันนี้';
		return day_formatter.format(n);
	};

	const group_by = <T>(arr: T[] = [], is_same_group: (left: T, right: T) => unknown): T[][] => {
		const grouped: T[][] = [];

		let curr;

		for (let i = 0; i < arr.length; i++) {
			if (curr && is_same_group(curr, arr[i])) {
				grouped[grouped.length - 1].push(arr[i]);
			} else {
				curr = arr[i];
				grouped.push([curr]);
			}
		}

		return grouped;
	};

	$: grouped =
		group_by($histories$, (left, right) => is_same_day(left.read_at, right.read_at)) || [];
</script>

<svelte:head>
	<title>ประวัติ</title>
</svelte:head>

<AppHeader />

<main class="mx-auto max-w-6xl pb-4 pt-12">
	<div class="flex flex-col gap-3 pt-4">
		{#each grouped as entries}
			<div class="w-24 text-center">
				{format_header(entries[0].read_at)}
			</div>

			{#each entries as { project_id, project_name, image_version, chapter_no, chapter_id, read_at } (project_id)}
				<div class="relative flex">
					<a href="/p/{project_id}" class="relative flex flex-1 gap-x-3 pl-4">
						<img
							src={get_project_thumbnail(project_id, image_version)}
							alt=""
							class="aspect-[2/3] w-16 rounded-md object-cover object-top"
						/>
						<div class="flex-1 self-center text-xs">
							<strong class="line-clamp-2"> {project_name} </strong>
							<span class="block pt-1">Ch. {chapter_no} - {read_at_formatter.format(read_at)}</span>
						</div>
					</a>
					<button
						class="flex-0 flex items-center px-2 hover:text-red-500"
						on:click={() => repository.del_history(project_id)}
					>
						<IconTrash />
					</button>
					<a
						class="flex-0 flex items-center pl-2 pr-4 hover:text-green-500"
						href="/p/{project_id}/{chapter_id}"
					>
						<IconPlayerPlay />
					</a>
				</div>
			{/each}
		{/each}
	</div>
</main>