<script>
	import { page } from '$app/stores';

	import { Expression } from '~/components/Expression';
</script>

<Expression>
	<span slot="face"> ┐(´ー｀)┌ </span>
	<div slot="desc">
		<h1 class="text-2xl">{$page.status}</h1>
		<pre>{$page.error.message}</pre>

		<a href="/" class="mt-16 inline-block rounded-md bg-zinc-800 p-2">กลับบ้าน</a>
	</div>
</Expression>
