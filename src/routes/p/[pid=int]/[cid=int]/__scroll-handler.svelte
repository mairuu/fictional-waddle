<script lang="ts">
	import type { HistoryEntity } from '~/lib/data/database';
	import type { Chapter } from '~/lib/types/nekopost';

	import { disableScrollHandling } from '$app/navigation';
	import { cal_scroll_y } from './+page.svelte';

	const handle_scroll_restoration = (
		history: HistoryEntity | undefined | void,
		chapter: Chapter,
		content_elm: HTMLElement | undefined
	) => {
		if (!content_elm) return;

		if (should_handle_scroll) {
			disableScrollHandling();
		}

		if (history && history.chapter_id === chapter.info.id) {
			window.scrollTo({ top: cal_scroll_y(content_elm, history.progress), left: 0 });
		} else {
			window.scrollTo({ top: 0, left: 0 });
		}
	};

	export let chapter: Chapter;
	export let history: HistoryEntity | undefined | void;

	export let content_elm: HTMLElement;
	export let should_handle_scroll: boolean;

	$: handle_scroll_restoration(history, chapter, content_elm);
</script>
