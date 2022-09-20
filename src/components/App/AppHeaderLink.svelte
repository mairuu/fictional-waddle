<script lang="ts">
	export let to: string;
	export let active: boolean;
</script>

<a
	href={to}
	class="flex p-4 leading-none sm:rounded-md sm:py-2 sm:px-3"
	class:bg-[#1864ab32]={active}
	class:text-sky-400={active}
	class:pointer-events-none={active}
>
	<slot />
</a>
