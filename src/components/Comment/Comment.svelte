<script lang="ts">
	import type { CommentSorting } from '~/lib/types/comment';

	import { repository } from '~/lib/data/repository';

	import CommentNode from './CommentNode.svelte';
	import CommentSkeleton from './CommentSkeleton.svelte';

	export let path: string;
	export let sort: CommentSorting = '-active';

	$: comments$ = repository.get_comment(path, { sort });
	$: comments = $comments$;
</script>

<div class="comment__root min-h-[200px]">
	<h3>คอมเมนต์ <small class="text-zinc-500"><i>(อ่านเท่านั้น)</i></small></h3>

	{#if comments.is_loading}
		{#each Array(3) as _} <CommentSkeleton /> {/each}
	{:else if comments.is_error}
		<!-- <div /> -->
	{:else}
		{#each comments.data.comments as node (node.comment.id)}
			<CommentNode {node} />
		{/each}
	{/if}
</div>
