<script lang="ts" context="module">
	import { onMount } from 'svelte';

	type ObserverCallback = (entry: IntersectionObserverEntry) => any;

	const callbacks = new Map<Element, ObserverCallback>();

	const create_observer = () =>
		new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => callbacks.get(entry.target)?.(entry));
			},
			{
				rootMargin: '360px 0px 1600px 0px',
			}
		);

	const observe = (elm: Element, callback: ObserverCallback) => {
		if (!observer) observer = create_observer();

		callbacks.set(elm, callback);
		observer.observe(elm);

		return () => {
			if (!callbacks.has(elm)) return;

			callbacks.delete(elm);
			observer?.unobserve(elm);

			if (callbacks.size !== 0) return;

			observer?.disconnect();
			observer = null;
		};
	};

	let observer: IntersectionObserver | null = null;
</script>

<script lang="ts">
	interface $$Props extends svelte.JSX.HTMLProps<HTMLImageElement> {}

	onMount(() => {
		unobserve = observe(elm, (entry) => {
			if (!entry.isIntersecting) return;

			intersected = true;
			unobserve();
		});

		return unobserve;
	});

	let elm: HTMLImageElement;
	let unobserve: ReturnType<typeof observe>;
	let intersected = false;

	$: src = intersected ? $$props.src : undefined;
</script>

<img bind:this={elm} alt="" {...$$restProps} {src} />
