<svelte:options immutable />

<script lang="ts">
	import { onDestroy } from 'svelte';

	import type { Readable } from '~/lib/types/store';

	type T = $$Generic;

	interface $$Slots {
		default: { data: T };
	}

	export let readable: Readable<T>;

	onDestroy(() => unsub?.());

	let data: T;
	let unsub: () => void | undefined;

	$: {
		unsub?.();
		unsub = readable.subscribe((d) => (data = d));
	}
</script>

<slot {data} />
