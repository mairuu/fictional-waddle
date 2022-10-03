<svelte:options immutable />

<script lang="ts">
	import type { Observable, Teardown } from '~/lib/types/store';

	import { onDestroy } from 'svelte';
	import { run_teardown } from '~/lib/store';

	type T = $$Generic;

	interface $$Slots {
		default: { data: T };
	}

	export let readable: Observable<T>;

	onDestroy(() => run_teardown(unsub));

	let data: T;
	let unsub: Teardown;

	$: {
		run_teardown(unsub);
		unsub = readable.subscribe((d) => (data = d));
	}
</script>

<slot {data} />
