<script lang="ts">
	import { get_tabs_context } from './Tabs.svelte';

	const { register_tab, select_tab, selected_tab } = get_tabs_context();
	const tab = register_tab();
</script>

<button
	class="tab border-t-solid {$$props.class || ''}"
	class:tab--active={$selected_tab === tab}
	on:click={() => select_tab(tab)}
>
	<slot />
</button>

<style>
	@tailwind components;

	@layer components {
		.tab {
			@apply block h-10 rounded-t-md rounded-bl-none px-4 text-sm;

			border-width: 1px 1px 0px;
			border-style: solid solid none;
			border-color: transparent transparent currentColor;
		}

		.tab--active {
			@apply border-zinc-700 bg-zinc-900;
		}
	}
</style>
