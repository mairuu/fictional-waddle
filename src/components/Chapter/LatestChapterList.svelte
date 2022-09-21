<script lang="ts">
	import { repository } from '~/lib/data/repository';
	import { project_type_lang } from '~/lib/types/nekopost';
	import { get_project_thumbnail } from '~/lib/utils/neko';

	import { ProjectCard } from '~/components/Card';
	import { FixedRowList } from '~/components/Container';

	import type { ProjectType } from '~/lib/types/nekopost';

	export let project_type: ProjectType;

	$: readable = repository.get_latest_chapters(project_type, 0);
	$: result = $readable;
</script>

<div class="my-4 flex items-center justify-between">
	<h3 class="text-2xl font-bold text-white">{project_type_lang[project_type]}ล่าสุด</h3>
	<a href="/latest/{project_type}" class="text-sm underline">เพิ่มเติม</a>
</div>

<FixedRowList
	class="mb-8 grid grid-cols-3 gap-2 sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))]"
	width={160}
	gap={8}
	datas={result.data || []}
	let:data
>
	<ProjectCard
		link="/p/{data.id}"
		title={data.name}
		thumbnail={get_project_thumbnail(data.id, data.image_version)}
	/>
</FixedRowList>
