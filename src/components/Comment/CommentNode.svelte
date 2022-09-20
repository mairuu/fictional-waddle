<script lang="ts">
	import { slide } from 'svelte/transition';
	import { format_distance } from '~/lib/utils/date';

	import { IconArrowDiagonal } from '~/components/Icons';

	import type { CommentNode } from '~/lib/types/comment';

	export let node: CommentNode;
	export let depth = 0;

	const { comment, replies = [] } = node;
	const {
		text,
		time,
		user: { picture, name },
	} = comment;

	const toggle_collapse = (ev?: MouseEvent) => {
		ev?.stopPropagation();
		collapse = !collapse;
	};

	const is_touch_device = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;

	let collapse = false;
</script>

<div class="relative" class:ml-6={depth !== 0}>
	<div class="absolute left-3 bottom-3 top-12 w-2 cursor-pointer" on:click={toggle_collapse}>
		<div class="h-full w-px bg-zinc-500" />
	</div>

	<article class="block py-3" on:click={() => is_touch_device() && toggle_collapse()}>
		<div class="flex items-center">
			{#if collapse}
				<button class="pl-1 pr-4" on:click={toggle_collapse}>
					<IconArrowDiagonal size={16} />
				</button>
			{/if}
			<div class="mr-2 h-7 w-7 overflow-hidden rounded-full bg-slate-500">
				<img src={picture} alt="" class="h-full w-full" />
			</div>
			<span class="text-sm">{name} </span>
			&nbsp;
			<span class="text-xs text-zinc-500">
				· {format_distance(time)}
			</span>
		</div>
		{#if !collapse}
			<div class="comment__body  mt-2 ml-9" transition:slide|local>{@html text}</div>
		{/if}
	</article>

	{#if !collapse}
		<div transition:slide|local>
			{#each replies as node (node.comment.id)}
				<svelte:self {node} depth={depth + 1} />
			{/each}
		</div>
	{/if}
</div>

<style global>
	.comment__body {
		word-break: break-word;
	}
	.comment__body p,
	.comment__body blockquote {
		line-height: 1.15;
		margin-bottom: 1rem;
	}
	.comment__body p:first-child,
	.comment__body blockquote:first-child {
		margin-top: 0;
	}
	.comment__body p:last-child,
	.comment__body blockquote:last-child {
		margin-bottom: 0;
	}
	.comment__body p br,
	.comment__body blockquote br {
		content: '';
		display: block;
		margin-top: 1rem;
	}
	/* .comment__body a {
		color: var(--color9);
	} */
	.comment__body a:hover {
		text-decoration: none;
	}
	.comment__body img {
		max-width: 100%;
		max-height: 300px;
	}
	.comment__body h1:first-child,
	.comment__body h2:first-child,
	.comment__body h3:first-child,
	.comment__body h4:first-child,
	.comment__body h5:first-child,
	.comment__body h6:first-child {
		margin-top: 0;
	}
	.comment__body blockquote {
		padding: 12px 8px 12px 16px;
		border-left: 2px solid;
	}
	.comment__body pre {
		padding: 12px 16px 12px 18px;
		overflow-x: auto;
		overflow-y: hidden;
		tab-size: 2;
		word-wrap: normal;
		font-size: 85%;
		line-height: 1.45;
		border-radius: 3px;
	}
	.comment__body pre:first-child {
		margin-top: 0;
	}
	.comment__body pre:last-child {
		margin-bottom: 0;
	}
	.comment__body pre > code {
		background-color: transparent;
		padding: 0;
	}
	.comment__body sup sup,
	.comment__body sup sub,
	.comment__body sub sup,
	.comment__body sub sub {
		vertical-align: middle;
	}
	.comment__body hr {
		border-width: 0 0 1px 0;
	}
</style>
