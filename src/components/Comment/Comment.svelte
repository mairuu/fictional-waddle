<script lang="ts">
	import { repository } from '~/lib/data/repository';

	import CommentNode from './CommentNode.svelte';
	import CommentSkeleton from './CommentSkeleton.svelte';

	import type { CommentSorting } from '~/lib/types/comment';

	export let path: string;
	export let sort: CommentSorting = '-active';

	$: readable = repository.get_comment(path, { sort });
	$: resource = $readable;
</script>

<div class="comment__root min-h-[200px]">
	<h3>คอมเมนต์ <small class="text-zinc-500"><i>(อ่านเท่านั้น)</i></small></h3>

	{#if resource.is_loading}
		{#each Array(3) as _}
			<CommentSkeleton />
		{/each}
	{:else if resource.is_error}
		<!-- <div /> -->
	{:else}
		{#each resource.data.comments as node (node.comment.id)}
			<CommentNode {node} />
		{/each}
	{/if}
</div>
