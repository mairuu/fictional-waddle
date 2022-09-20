<svelte:options immutable />

<script lang="ts">
	export let link = '.';
	export let title = '';
	export let thumbnail = '';
</script>

<a class="relative aspect-[2/3] overflow-hidden rounded-md shadow-sm" href={link} {title}>
	<img
		alt=""
		src={thumbnail}
		class="absolute h-full w-full object-cover object-top"
		loading="lazy"
	/>
	<div class="gradient pointer-events-none absolute inset-0 from-transparent to-black/80" />
	<div class="absolute inset-x-0 bottom-0 p-2 text-white md:p-3">
		<span class="leading-5 line-clamp-2"> {title} </span>
	</div>
</a>

<style>
	.gradient {
		background-image: linear-gradient(
			180deg,
			var(--tw-gradient-from) 60%,
			var(--tw-gradient-to) 90%
		);
	}
</style>
