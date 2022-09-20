<script lang="ts" context="module">
	export interface TabsContext {
		register_tab: () => {};
		register_panel: () => {};
		select_tab: (id: object) => void;
		selected_tab: Writable<object | null>;
		selected_panel: Writable<object | null>;
	}

	const TABS = Symbol();
	export const get_tabs_context = () => getContext(TABS) as TabsContext;
</script>

<script lang="ts">
	import { getContext, onDestroy, setContext } from 'svelte';
	import { writable } from '~/lib/store';

	import type { Writable } from '~/lib/types/store';

	interface $$Props extends svelte.JSX.HTMLProps<HTMLElement> {}

	const tabs: object[] = [];
	const panels: object[] = [];
	const selected_tab = writable<object | null>(null);
	const selected_panel = writable<object | null>(null);

	setContext<TabsContext>(TABS, {
		register_tab: () => {
			const id = {};
			tabs.push(id);
			selected_tab.update((current) => current || id);

			onDestroy(() => {
				const i = tabs.indexOf(id);
				tabs.splice(i, 1);
				selected_tab.update((current) =>
					current === id ? tabs[i] || tabs[tabs.length - 1] : current
				);
			});

			return id;
		},

		register_panel: () => {
			const id = {};
			panels.push(id);
			selected_panel.update((current) => current || id);

			onDestroy(() => {
				const i = panels.indexOf(id);
				panels.splice(i, 1);
				selected_panel.update((current) =>
					current === id ? panels[i] || panels[panels.length - 1] : current
				);
			});

			return id;
		},

		select_tab: (id: object) => {
			selected_tab.set(id);
			selected_panel.set(panels[tabs.indexOf(id)]);
		},

		selected_tab,
		selected_panel,
	});
</script>

<div {...$$restProps}>
	<slot />
</div>
