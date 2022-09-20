<script lang="ts">
	import { get_tabs_context } from './Tabs.svelte';

	interface $$Props extends svelte.JSX.HTMLProps<HTMLElement> {}

	const { register_panel, selected_panel } = get_tabs_context();
	const panel = register_panel();
</script>

{#if $selected_panel === panel}
	<section {...$$restProps}><slot /></section>
{/if}
