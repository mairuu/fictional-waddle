<script lang="ts">
	import 'nprogress/nprogress.css';
	import '~/app.css';

	import { navigating } from '$app/stores';
	import npogress from 'nprogress';

	let nav_loading_timeout: ReturnType<typeof setTimeout>;

	$: if ($navigating) {
		nav_loading_timeout = setTimeout(npogress.start, 150);
	} else {
		clearTimeout(nav_loading_timeout);
		npogress.done();
	}
</script>

<svelte:head>
	<link
		href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<slot />
