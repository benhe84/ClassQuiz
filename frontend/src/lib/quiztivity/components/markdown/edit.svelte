<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)

SPDX-License-Identifier: MPL-2.0
-->

<script lang="ts">
	import type { Markdown } from '$lib/quiztivity/types';
	import { marked } from 'marked';
	import { browser } from '$app/environment';

	interface Props {
		data: Markdown | undefined;
	}

	let { data = $bindable() }: Props = $props();

	if (!data) {
		data = {
			markdown: ''
		};
	}

	let rendered_html = $derived(browser ? marked.parse(data.markdown) : '');
</script>

<div class="w-full h-[70vh] flex flex-row p-4 gap-4">
	<textarea
		class="w-full resize-none border-2 border-base rounded-sm outline-none p-2 bg-surface text-base placeholder:text-muted focus:border-primary"
		bind:value={data.markdown}
		placeholder="Enter your markdown here!"
	></textarea>

	<div class="w-full">
		<div
			class="aspect-video prose max-w-none border-2 border-base rounded-sm p-2 bg-surface text-base dark:prose-invert"
		>
			{@html rendered_html}
		</div>
	</div>
</div>
