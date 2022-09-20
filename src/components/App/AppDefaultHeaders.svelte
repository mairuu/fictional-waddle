<script lang="ts">
	import { page } from '$app/stores';
	import { slide } from 'svelte/transition';
	import { IconList } from '~/components/Icons';

	import AppHeaderLink from './AppHeaderLink.svelte';

	export let open = false;

	const links = [
		{ to: '/', active_on: '', label: 'หน้าหลัก' },
		{ to: '/favorite', active_on: 'favorite', label: 'ชื่นชอบ' },
		{ to: '/history', active_on: 'history', label: 'ประวัติ' },
	];

	$: route_id = $page.routeId;
</script>

<div class="mx-auto flex h-full max-w-6xl items-center">
	<div class="hidden gap-3 px-4 sm:flex">
		{#each links as { to, active_on, label }}
			<AppHeaderLink {to} active={route_id === active_on}>{label}</AppHeaderLink>
		{/each}
	</div>

	<button on:click={() => (open = !open)} class="z-10 h-full px-4 sm:hidden">
		<IconList />
	</button>

	{#if open}
		<div
			class="absolute inset-x-0 top-12 z-0 h-screen bg-zinc-900 sm:hidden"
			transition:slide|local={{ duration: 100 }}
		>
			{#each links as { to, active_on, label }}
				<AppHeaderLink {to} active={route_id === active_on}>{label}</AppHeaderLink>
			{/each}
		</div>
	{/if}
</div>
