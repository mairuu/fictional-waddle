<script lang="ts" context="module">
	const histories$ = repository.get_histories();
</script>

<script lang="ts">
	import { repository } from '~/lib/data/repository';
	import { is_resource_error } from '~/lib/utils/resource';
	import { is_same_day, is_today } from '~/lib/utils/date';
	import { format_date } from '~/lib/utils/neko';

	import { AppHeader } from '~/components/App';
	import { Expression } from '~/components/Expression';
	import { Skeleton } from '~/components/Skeleton';

	import HistoryRow from './__rc_history-row.svelte';

	const format_header = (date: number) => {
		if (is_today(date)) return 'วันนี้';
		return format_date(date);
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

	$: histories = $histories$;
	$: grouped = group_by(histories.data || [], (left, right) =>
		is_same_day(left.read_at, right.read_at)
	);
</script>

<svelte:head>
	<title>ประวัติ</title>
</svelte:head>

<AppHeader />

<main class="mx-auto max-w-6xl px-4 pt-12">
	{#if is_resource_error(histories)}
		<Expression>
			<span slot="face">╭(°ﾛ° ”)╯</span>
			<span slot="desc">แย่ล่ะ</span>
		</Expression>
	{:else if histories.data?.length === 0}
		<Expression>
			<span slot="face">( ･ω･)ﾉ</span>
			<span slot="desc"> โล่งมาก... </span>
		</Expression>
	{:else}
		<div class="mb-8 flex flex-col gap-3 pt-4">
			{#if histories.data}
				{#each grouped as entities}
					<div class="w-16 text-center">{format_header(entities[0].read_at)}</div>
					{#each entities as entity (entity.project_id)} <HistoryRow data={entity} /> {/each}
				{/each}
			{:else}
				<div class="w-16 text-center">
					<Skeleton class="inline-block h-4 w-12" />
				</div>
				{#each Array(6) as _} <Skeleton class="flex h-24" /> {/each}
			{/if}
		</div>
	{/if}
</main>
