<script lang="ts">
	interface $$Props extends svelte.JSX.HTMLProps<HTMLElement> {}
</script>

<div
	{...$$restProps}
	class="relative overflow-hidden after:absolute after:inset-0 after:z-20 after:bg-zinc-800 after:content-[''] {$$props.class ||
		''}"
>
	<slot />
</div>
