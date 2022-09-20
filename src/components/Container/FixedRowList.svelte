<script lang="ts">
	import { Skeleton } from '~/components/Skeleton';

	type T = $$Generic;

	interface $$Props extends svelte.JSX.HTMLProps<HTMLElement> {
		gap?: number;
		datas: T[];
		width: number;
		get_key?: (data: T, i: number) => unknown;
	}

	interface $$Slots {
		default: { data: T; i: number };
	}

	export let gap = 0;
	export let datas: $$Props['datas'];
	export let width: $$Props['width'];
	export let get_key: NonNullable<$$Props['get_key']> = (data) => data;

	let client_width: number;

	$: item_per_row = client_width
		? client_width > 596
			? Math.floor((client_width + gap) / (width + gap))
			: 3
		: 0;
	$: rows = item_per_row === 3 ? 2 : 1;
	$: items = datas.slice(0, item_per_row * rows);
</script>

<div {...$$restProps} bind:clientWidth={client_width}>
	{#if items.length === 0}
		{#each Array(6) as _} <Skeleton class="aspect-[2/3] rounded-md" /> {/each}
	{:else}
		{#each items as data, i (get_key(data, i))} <slot {data} {i} /> {/each}
	{/if}
</div>
