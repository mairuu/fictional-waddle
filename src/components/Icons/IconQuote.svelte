<script lang="ts">
	interface $$Props extends svelte.JSX.SVGProps<SVGAElement> {
		size?: string | number | null | undefined;
	}
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 409.294 409.294"
	fill="currentColor"
	{...$$restProps}
	width={$$props.width || $$props.size || 24}
	height={$$props.height || $$props.size || 24}
>
	<path
		d="M0 204.647v175.412h175.412V204.647H58.471c0-64.48 52.461-116.941 116.941-116.941V29.235C78.684 29.235 0 107.919 0 204.647zM409.294 87.706V29.235c-96.728 0-175.412 78.684-175.412 175.412v175.412h175.412V204.647H292.353c0-64.48 52.461-116.941 116.941-116.941z"
	/>
</svg>
