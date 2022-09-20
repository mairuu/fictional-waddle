<script lang="ts">
	import { browser } from '$app/env';
	import { onMount } from 'svelte';
	import { noop } from 'svelte/internal';
	import { clamp } from '~/lib/utils/math';

	import AppDefaultHeader from './AppDefaultHeaders.svelte';

	export let with_transparent = false;

	onMount(() => {
		update_appbar_opacity();
	});

	let open = false;

	$: appbar_opacity = with_transparent ? 0 : 1;

	$: update_appbar_opacity =
		with_transparent && browser && !open
			? () => (appbar_opacity = clamp(window.scrollY / 200, 0, 1))
			: noop;

	$: if (open) appbar_opacity = 1;
	else update_appbar_opacity();
</script>

<svelte:window on:scroll|passive={update_appbar_opacity} />

<nav
	style:--tw-bg-opacity={appbar_opacity}
	style:--tw-border-opacity={appbar_opacity}
	class="fixed inset-x-0 top-0 z-50 h-12 border-b border-zinc-700 border-opacity-0 bg-zinc-900 bg-opacity-0"
>
	{#if !$$slots.default}
		<AppDefaultHeader bind:open />
	{/if}

	<slot />
</nav>
