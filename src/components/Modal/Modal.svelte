<script context="module" lang="ts">
	export interface ModalApi {
		open: () => void;
		close: () => void;
	}

	export const modals = new Map<any, ModalApi>();
</script>

<script lang="ts">
	import { browser } from '$app/env';
	import { onDestroy } from 'svelte';

	export const id = {};

	onDestroy(() => {
		modals.delete(id);
		if (browser) window.removeEventListener('keydown', key_down);
	});

	const key_down = (ev: KeyboardEvent) => {
		if (ev.key === 'Escape') close();
	};

	const open = () => {
		if (visible) return;

		visible = true;
		window.addEventListener('keydown', key_down);
		document.body.style.setProperty('overflow', 'hidden');
	};

	const close = () => {
		if (!visible) return;

		visible = false;
		window.removeEventListener('keydown', key_down);
		document.body.style.setProperty('overflow', null);
	};

	export const modal_api: ModalApi = { open, close };

	modals.set(id, modal_api);

	let visible = false;
</script>

{#if visible}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md"
		on:click={close}
	>
		<div class="absolute top-4 right-4 z-10">
			<button class="rounded-full bg-zinc-800 p-6 shadow-lg"> ปิด </button>
		</div>
		<div class="relative h-full rounded-md p-4" on:click|stopPropagation><slot /></div>
	</div>
{/if}
