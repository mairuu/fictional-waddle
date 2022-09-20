<script lang="ts">
	interface $$Props extends svelte.JSX.SVGProps<SVGAElement> {
		size?: string | number | null | undefined;
	}
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 24 24"
	stroke-width="2"
	stroke="currentColor"
	stroke-linecap="round"
	stroke-linejoin="round"
	fill="currentColor"
	{...$$restProps}
	width={$$props.width || $$props.size || 24}
	height={$$props.height || $$props.size || 24}
>
	<path stroke="none" d="M0 0h24v24H0z" fill="none" />
	<path d="M7 4v16l13 -8z" />
</svg>
