<script lang="ts" context="module">
	const histories$ = repository.get_histories({ take: 6 });
</script>

<script lang="ts">
	import { repository } from '~/lib/data/repository';
	import { get_project_thumbnail } from '~/lib/utils/neko';
	import { is_resource_error } from '~/lib/utils/resource';

	import { Skeleton } from '~/components/Skeleton';

	$: histories = $histories$;
</script>

{#if !is_resource_error(histories)}
	<h3 class="my-4 text-2xl font-bold">เมื่อเร็วๆนี้</h3>

	<div class="mb-8 grid grid-cols-2 gap-2 lg:grid-cols-3">
		{#if histories.data}
			{#each histories.data as { project_id, project_name, image_version }}
				<a
					href="/p/{project_id}"
					title={project_name}
					class="relative flex h-16 overflow-hidden rounded-md md:h-20"
				>
					<img
						src={get_project_thumbnail(project_id, image_version)}
						alt=""
						class="aspect-square object-cover object-top"
					/>
					<div class="flex-1 self-center px-3 text-xs sm:text-sm">
						<strong class="line-clamp-2"> {project_name} </strong>
					</div>
				</a>
			{/each}

			{#each Array(6 - histories.data.length) as _}
				<div class="relative flex h-16 overflow-hidden rounded-md md:h-20" />
			{/each}
		{:else if histories.is_loading}
			{#each Array(6) as _}
				<Skeleton class="relative flex h-16 overflow-hidden rounded-md md:h-20" />
			{/each}
		{/if}
	</div>
{/if}
